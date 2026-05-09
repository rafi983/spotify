"use client"

import type { Track } from "@/lib/music-data"
import { usePlayer } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Download, Heart, MoreHorizontal, Play, Search, Shuffle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface SavedSong {
  id: string
  title: string
  artist: string
  album: string
  coverUrl: string
  duration: string
  addedAt: string
  uri: string
}

function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function LikedSongsContent() {
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer()
  const [songs, setSongs] = useState<SavedSong[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const token = await getAccessToken()
      if (!token) { setLoading(false); return }
      try {
        const res = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        setTotal(data.total ?? 0)
        setSongs(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data.items ?? []).map((item: any) => ({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map((a: any) => a.name).join(", "),
            album: item.track.album.name,
            coverUrl: item.track.album.images?.[0]?.url ?? "",
            duration: fmtMs(item.track.duration_ms),
            addedAt: new Date(item.added_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            uri: item.track.uri,
          }))
        )
      } catch (err) {
        console.error("[liked songs]", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSongClick = (song: SavedSong) => {
    const track: Track = {
      id: 0,
      title: song.title,
      artist: song.artist,
      album: song.album,
      coverUrl: song.coverUrl,
      uri: song.uri,
    }
    play(track)
  }

  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-b from-[#5038a0] via-[#3d2d7a] to-[#121212]">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-black/40 hover:bg-black/60 rounded-full py-1 px-1 pr-3 transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm">
              E
            </div>
            <span className="text-white text-sm font-semibold">Enoch Emmanuel</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Playlist Header */}
        <div className="flex items-end gap-6 p-6 pt-8">
          <div className="w-[232px] h-[232px] bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded shadow-2xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-24 h-24 fill-white text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white text-xs font-medium uppercase">Public Playlist</span>
            <h1 className="text-white text-7xl font-bold tracking-tight">Liked Songs</h1>
            <div className="flex items-center gap-1 mt-4">
              <span className="text-white font-semibold">Enoch</span>
              <span className="text-white/70 mx-1">•</span>
              <span className="text-white/70">{total} Songs</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-6 pt-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => currentTrack ? togglePlay() : songs[0] && handleSongClick(songs[0])}
              className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all"
            >
              {isPlaying && currentTrack ? (
                <svg className="w-7 h-7 text-black fill-black" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <Play className="w-7 h-7 text-black fill-black ml-1" />
              )}
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Shuffle className="w-8 h-8" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Download className="w-8 h-8" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 text-[#b3b3b3] hover:text-white text-sm transition-colors">
              Custom order
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] gap-4 px-4 py-2 text-[#b3b3b3] text-sm border-b border-white/10 sticky top-0 bg-[#121212]">
          <span>#</span>
          <span>TITLE</span>
          <span>ALBUM</span>
          <span>DATE ADDED</span>
          <span className="flex justify-end">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        {/* Song Rows */}
        <div className="pb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="w-4 h-4 bg-[#282828] rounded animate-pulse" />
                <div className="w-10 h-10 bg-[#282828] rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#282828] rounded animate-pulse w-1/3" />
                  <div className="h-2.5 bg-[#282828] rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="text-center py-16 text-[#b3b3b3]">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No liked songs yet. Like songs on Spotify to see them here.</p>
            </div>
          ) : (
            songs.map((song, index) => {
              const isActive = currentTrack?.uri === song.uri || (currentTrack?.title === song.title && currentTrack?.artist === song.artist)
              return (
                <div
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className={`grid grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] gap-4 px-4 py-2 text-sm hover:bg-white/10 rounded group items-center cursor-pointer ${
                    isActive ? "bg-white/5" : ""
                  }`}
                >
                  {isActive && isPlaying ? (
                    <span className="flex items-end gap-px h-4 group-hover:hidden">
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"60%"}} />
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"100%",animationDelay:"0.15s"}} />
                      <span className="w-0.5 bg-[#1DB954] rounded-sm animate-pulse" style={{height:"40%",animationDelay:"0.3s"}} />
                    </span>
                  ) : (
                    <span className={`group-hover:hidden ${isActive ? "text-[#1DB954]" : "text-[#b3b3b3]"}`}>{index + 1}</span>
                  )}
                  <Play className="w-4 h-4 text-white hidden group-hover:block fill-white" />

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 flex-shrink-0 bg-[#282828] rounded">
                      {song.coverUrl && (
                        <Image src={song.coverUrl} alt={song.title} fill className="object-cover rounded" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate font-medium ${isActive ? "text-[#1DB954]" : "text-white"}`}>{song.title}</p>
                      <p className="text-[#b3b3b3] truncate text-xs">{song.artist}</p>
                    </div>
                  </div>

                  <span className="text-[#b3b3b3] truncate">{song.album}</span>
                  <span className="text-[#b3b3b3] text-xs">{song.addedAt}</span>
                  <div className="flex items-center justify-end gap-3">
                    <Heart className="w-4 h-4 fill-[#1DB954] text-[#1DB954]" />
                    <span className="text-[#b3b3b3]">{song.duration}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}
