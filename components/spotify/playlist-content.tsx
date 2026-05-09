"use client"

import type { Track } from "@/lib/music-data"
import { usePlayer } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { ChevronLeft, ChevronRight, Clock, Heart, MoreHorizontal, Play, Shuffle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface PlaylistTrack {
  id: string
  title: string
  artist: string
  album: string
  coverUrl: string
  duration: string
  addedAt: string
  uri: string
}

interface PlaylistMeta {
  name: string
  description: string
  image?: string
  owner: string
  total: number
}

function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface Props {
  playlistId: string
  onBack: () => void
}

export function PlaylistContent({ playlistId, onBack }: Props) {
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer()
  const [meta, setMeta] = useState<PlaylistMeta | null>(null)
  const [tracks, setTracks] = useState<PlaylistTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTracks([])
    setMeta(null)
    ;(async () => {
      const token = await getAccessToken()
      if (!token) { setLoading(false); return }
      try {
        const headers = { Authorization: `Bearer ${token}` }

        // Strategy 1: Full playlist object (includes up to 100 tracks)
        const plRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers })
        const plData = await plRes.json()

        if (!plRes.ok) {
          console.error("[playlist] meta failed:", plRes.status, plData)
          setLoading(false)
          return
        }

        // Spotify returns tracks paging object at plData.items or plData.tracks
        const paging = plData.items ?? plData.tracks ?? {}
        let items = Array.isArray(paging) ? paging : (paging.items ?? [])
        const total = paging.total ?? items.length

        // Paginate: follow next URL to load remaining tracks
        let nextUrl = paging.next as string | null
        while (nextUrl) {
          try {
            const nextRes = await fetch(nextUrl, { headers })
            if (!nextRes.ok) break
            const nextData = await nextRes.json()
            const nextItems = nextData.items ?? []
            items = [...items, ...nextItems]
            nextUrl = nextData.next
          } catch { break }
        }

        setMeta({
          name: plData.name,
          description: plData.description ?? "",
          image: plData.images?.[0]?.url,
          owner: plData.owner?.display_name ?? "",
          total,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTracks((items ?? []).map((entry: any) => {
          const t = entry.item ?? entry.track
          if (!t?.name) return null
          return {
            id: t.id ?? "",
            title: t.name,
            artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
            album: t.album?.name ?? "",
            coverUrl: t.album?.images?.[0]?.url ?? "",
            duration: fmtMs(t.duration_ms ?? 0),
            addedAt: entry.added_at ? new Date(entry.added_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
            uri: t.uri ?? "",
          }
        }).filter(Boolean) as PlaylistTrack[])
      } catch (err) {
        console.error("[playlist]", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [playlistId])

  const handlePlay = (t: PlaylistTrack) => {
    const track: Track = { id: 0, title: t.title, artist: t.artist, album: t.album, coverUrl: t.coverUrl, uri: t.uri }
    play(track)
  }

  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col">
      <div className="bg-gradient-to-b from-[#1e3a2f] via-[#152d22] to-[#121212]">
        {/* Top bar */}
        <div className="flex items-center gap-2 p-4">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Playlist header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 p-4 sm:p-6 pt-2">
          <div className="w-32 h-32 sm:w-[180px] sm:h-[180px] rounded shadow-2xl flex-shrink-0 overflow-hidden relative bg-[#282828]">
            {meta?.image ? (
              <Image src={meta.image} alt={meta.name ?? ""} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#535353]" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0 text-center sm:text-left">
            <span className="text-white text-xs font-medium uppercase">Playlist</span>
            {loading ? (
              <div className="h-10 w-48 bg-[#282828] rounded animate-pulse mt-1" />
            ) : (
              <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight truncate">{meta?.name}</h1>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 sm:mt-3 text-sm">
              <span className="text-white font-semibold">{meta?.owner}</span>
              {meta?.total !== undefined && (
                <><span className="text-white/50 mx-1">•</span><span className="text-white/70">{meta.total} songs</span></>
              )}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-6 p-6 pt-4">
          <button
            onClick={() => currentTrack ? togglePlay() : tracks[0] && handlePlay(tracks[0])}
            className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all"
          >
            {isPlaying && currentTrack ? (
              <svg className="w-7 h-7 text-black fill-black" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            )}
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors"><Shuffle className="w-8 h-8" /></button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors"><MoreHorizontal className="w-8 h-8" /></button>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6">
        <div className="hidden md:grid grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] gap-4 px-4 py-2 text-[#b3b3b3] text-sm border-b border-white/10 sticky top-0 bg-[#121212]">
          <span>#</span><span>TITLE</span><span>ALBUM</span><span>DATE ADDED</span>
          <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
        </div>
        <div className="pb-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="w-4 h-4 bg-[#282828] rounded animate-pulse" />
                <div className="w-10 h-10 bg-[#282828] rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#282828] rounded animate-pulse w-1/3" />
                  <div className="h-2.5 bg-[#282828] rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))
          ) : tracks.map((t, i) => {
            const isActive = currentTrack?.uri === t.uri || (currentTrack?.title === t.title && currentTrack?.artist === t.artist)
            return (
              <div
                key={t.id}
                onClick={() => handlePlay(t)}
                className={`flex items-center gap-3 md:grid md:grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] md:gap-4 px-3 md:px-4 py-2 text-sm hover:bg-white/10 rounded group cursor-pointer ${isActive ? "bg-white/5" : ""}`}
              >
                <div className="hidden md:block">
                  {isActive && isPlaying ? (
                    <span className="flex items-end gap-px h-4 group-hover:hidden">
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"60%"}} />
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"100%",animationDelay:"0.15s"}} />
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"40%",animationDelay:"0.3s"}} />
                    </span>
                  ) : (
                    <span className={`group-hover:hidden ${isActive ? "text-[#1DB954]" : "text-[#b3b3b3]"}`}>{i + 1}</span>
                  )}
                  <Play className="w-4 h-4 text-white hidden group-hover:block fill-white" />
                </div>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-10 h-10 flex-shrink-0 bg-[#282828] rounded">
                    {t.coverUrl && <Image src={t.coverUrl} alt={t.title} fill className="object-cover rounded" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate font-medium ${isActive ? "text-[#1DB954]" : "text-white"}`}>{t.title}</p>
                    <p className="text-[#b3b3b3] truncate text-xs">{t.artist}</p>
                  </div>
                </div>
                <span className="text-[#b3b3b3] truncate hidden md:block">{t.album}</span>
                <span className="text-[#b3b3b3] text-xs hidden md:block">{t.addedAt}</span>
                <div className="flex items-center justify-end">
                  <span className="text-[#b3b3b3] text-xs">{t.duration}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
