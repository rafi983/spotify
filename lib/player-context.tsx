"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { TRACKS, type Track } from "./music-data"
import { getAccessToken } from "./spotify-auth"

// Module-level singleton — prevents duplicate players on HMR/StrictMode remounts
let _sdkPlayer: SpotifyPlayer | null = null
let _sdkDeviceId: string | null = null
let _sdkScriptAdded = false
let _sdkReadyCallbacks: (() => void)[] = []

function onSdkReady(cb: () => void) {
  if (typeof window !== "undefined" && window.Spotify) { cb(); return }
  _sdkReadyCallbacks.push(cb)
}

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  isLoading: boolean
  isDeviceReady: boolean
  currentTime: number
  duration: number
  volume: number
  play: (track: Track) => void
  togglePlay: () => void
  seek: (time: number) => void
  changeVolume: (v: number) => void
  skipNext: () => void
  skipPrev: () => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

async function searchSpotifyUri(title: string, artist: string, token: string): Promise<string | null> {
  const q = encodeURIComponent(`track:${title} artist:${artist}`)
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return (data.tracks?.items?.[0]?.uri as string) ?? null
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<SpotifyPlayer | null>(null)
  const deviceIdRef = useRef<string | null>(null)
  const currentTrackRef = useRef<Track | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeviceReady, setIsDeviceReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.75)

  useEffect(() => {
    currentTrackRef.current = currentTrack
  }, [currentTrack])

  // ── Load Spotify Web Playback SDK once (singleton) ───────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return

    // Reuse existing player if already initialised (HMR / StrictMode)
    if (_sdkPlayer) {
      playerRef.current = _sdkPlayer
      if (_sdkDeviceId) {
        deviceIdRef.current = _sdkDeviceId
        setIsDeviceReady(true)
      }
      // Re-attach state listener to this component instance
      _sdkPlayer.addListener("player_state_changed", handleState)
      return () => { _sdkPlayer?.removeListener("player_state_changed", handleState) }
    }

    function handleState(state: SpotifyWebPlaybackState | null) {
      if (!state) return
      const sdkTrack = state.track_window.current_track
      if (sdkTrack) {
        setCurrentTrack((prev) =>
          prev ? {
            ...prev,
            title: sdkTrack.name,
            artist: sdkTrack.artists[0]?.name ?? prev.artist,
            coverUrl: sdkTrack.album.images[0]?.url ?? prev.coverUrl,
          } : prev
        )
      }
      setIsPlaying(!state.paused)
      setIsLoading(false)
      setDuration(state.duration / 1000)
      setCurrentTime(state.position / 1000)
    }

    const init = () => {
      getAccessToken().then((token) => {
        if (!token || _sdkPlayer) return

        const player = new window.Spotify.Player({
          name: "Spotify Clone",
          getOAuthToken: (cb) => { getAccessToken().then((t) => { if (t) cb(t) }) },
          volume: 0.75,
        })

        player.addListener("ready", ({ device_id }) => {
          _sdkDeviceId = device_id
          deviceIdRef.current = device_id
          setIsDeviceReady(true)
        })
        player.addListener("not_ready", () => {
          _sdkDeviceId = null
          deviceIdRef.current = null
          setIsDeviceReady(false)
        })
        player.addListener("initialization_error", ({ message }) => console.error("[SDK] init:", message))
        player.addListener("authentication_error", ({ message }) => {
          console.error("[SDK] auth:", message)
          setIsDeviceReady(false)
        })
        player.addListener("account_error", ({ message }) => console.error("[SDK] account (Premium required):", message))
        player.addListener("player_state_changed", handleState)

        player.connect()
        _sdkPlayer = player
        playerRef.current = player
      })
    }

    if (window.Spotify) {
      init()
    } else if (!_sdkScriptAdded) {
      _sdkScriptAdded = true
      window.onSpotifyWebPlaybackSDKReady = () => {
        _sdkReadyCallbacks.forEach((cb) => cb())
        _sdkReadyCallbacks = []
      }
      onSdkReady(init)
      const script = document.createElement("script")
      script.src = "https://sdk.scdn.co/spotify-player.js"
      script.async = true
      document.head.appendChild(script)
    } else {
      onSdkReady(init)
    }

    return () => { /* keep player alive across remounts */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Poll position while playing ───────────────────────────────────────────
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (!isPlaying) return
    pollRef.current = setInterval(async () => {
      const state = await playerRef.current?.getCurrentState()
      if (state) setCurrentTime(state.position / 1000)
    }, 500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [isPlaying])

  // ── Core: play a track ────────────────────────────────────────────────────
  const play = useCallback((track: Track) => {
    setCurrentTrack(track)
    currentTrackRef.current = track
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)

    ;(async () => {
      try {
        const token = await getAccessToken()
        if (!token || !deviceIdRef.current) { setIsLoading(false); return }

        const uri = track.uri ?? await searchSpotifyUri(track.title, track.artist, token)
        if (!uri) { setIsLoading(false); return }

        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [uri] }),
          }
        )
      } catch (err) {
        console.error("[play]", err)
        setIsLoading(false)
      }
    })()
  }, [])

  const togglePlay = useCallback(() => {
    const p = playerRef.current
    if (!p) { play(TRACKS[0]); return }
    ;(async () => {
      const state = await p.getCurrentState()
      if (!state) { play(TRACKS[0]); return }
      if (state.paused) await p.resume()
      else await p.pause()
    })()
  }, [play])

  const seek = useCallback((time: number) => {
    playerRef.current?.seek(time * 1000)
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v))
    playerRef.current?.setVolume(clamped)
    setVolumeState(clamped)
  }, [])

  const skipNext = useCallback(() => {
    const curr = currentTrackRef.current
    if (!curr) { play(TRACKS[0]); return }
    const idx = TRACKS.findIndex((t) => t.id === curr.id)
    play(TRACKS[(idx + 1) % TRACKS.length])
  }, [play])

  const skipPrev = useCallback(() => {
    const p = playerRef.current
    if (!p) return
    ;(async () => {
      const state = await p.getCurrentState()
      if (state && state.position > 3000) {
        await p.seek(0)
        setCurrentTime(0)
        return
      }
      const curr = currentTrackRef.current
      if (!curr) { play(TRACKS[TRACKS.length - 1]); return }
      const idx = TRACKS.findIndex((t) => t.id === curr.id)
      play(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length])
    })()
  }, [play])

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        isDeviceReady,
        currentTime,
        duration,
        volume,
        play,
        togglePlay,
        seek,
        changeVolume,
        skipNext,
        skipPrev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>")
  return ctx
}
