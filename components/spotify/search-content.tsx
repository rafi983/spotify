"use client"

import type { Track } from "@/lib/music-data"
import { usePlayer } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { ChevronLeft, ChevronRight, Play, Search, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface SearchTrack {
  id: string
  name: string
  artist: string
  album: string
  coverUrl: string
  duration: string
  uri: string
}

interface SearchArtist {
  id: string
  name: string
  image: string
  followers: string
}

interface SearchAlbum {
  id: string
  name: string
  artist: string
  image: string
  year: string
}

function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function fmtFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const browseCategories = [
  { name: "Pop", color: "#8D6748" }, { name: "Hip-Hop", color: "#8338EC" },
  { name: "R&B", color: "#DC148C" }, { name: "Rock", color: "#E13300" },
  { name: "Chill", color: "#1DB954" }, { name: "Mood", color: "#E8612A" },
  { name: "Workout", color: "#E91E8C" }, { name: "Party", color: "#148A08" },
  { name: "Indie", color: "#1E3264" }, { name: "Jazz", color: "#643CB5" },
  { name: "Electronic", color: "#0D73EC" }, { name: "Classical", color: "#2D4654" },
]

export function SearchContent() {
  const { play, currentTrack, isPlaying } = usePlayer()
  const [query, setQuery] = useState("")
  const [tracks, setTracks] = useState<SearchTrack[]>([])
  const [artists, setArtists] = useState<SearchArtist[]>([])
  const [albums, setAlbums] = useState<SearchAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setTracks([]); setArtists([]); setAlbums([]); return }
    setLoading(true)
    try {
      const token = await getAccessToken()
      if (!token) return
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track,artist,album&limit=10&market=from_token`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) return
      const data = await res.json()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTracks((data.tracks?.items ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: t.artists.map((a: any) => a.name).join(", "),
        album: t.album.name,
        coverUrl: t.album.images?.[0]?.url ?? "",
        duration: fmtMs(t.duration_ms),
        uri: t.uri,
      })))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setArtists((data.artists?.items ?? []).slice(0, 6).map((a: any) => ({
        id: a.id,
        name: a.name,
        image: a.images?.[0]?.url ?? "",
        followers: fmtFollowers(a.followers?.total ?? 0),
      })))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAlbums((data.albums?.items ?? []).slice(0, 6).map((a: any) => ({
        id: a.id,
        name: a.name,
        artist: a.artists.map((x: any) => x.name).join(", "),
        image: a.images?.[0]?.url ?? "",
        year: a.release_date?.slice(0, 4) ?? "",
      })))
    } catch (err) {
      console.error("[search]", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const handlePlayTrack = (t: SearchTrack) => {
    const track: Track = { id: 0, title: t.name, artist: t.artist, album: t.album, coverUrl: t.coverUrl, uri: t.uri }
    play(track)
  }

  const handleGenreSearch = (genre: string) => {
    setQuery(genre)
    inputRef.current?.focus()
  }

  const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0
  const showBrowse = !query.trim()

  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 max-w-[480px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#121212]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full h-12 pl-12 pr-10 bg-white rounded-full text-sm text-[#121212] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-white"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#121212]">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {showBrowse ? (
          <section>
            <h2 className="text-2xl font-bold text-white mb-5">Browse all</h2>
            <div className="grid grid-cols-4 gap-4">
              {browseCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleGenreSearch(cat.name)}
                  className="relative h-[120px] rounded-lg overflow-hidden text-left hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: cat.color }}
                >
                  <h3 className="absolute top-4 left-4 text-xl font-bold text-white">{cat.name}</h3>
                </button>
              ))}
            </div>
          </section>
        ) : loading ? (
          <div className="space-y-3 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#282828] rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#282828] rounded animate-pulse w-1/3" />
                  <div className="h-2.5 bg-[#282828] rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !hasResults ? (
          <div className="text-center py-16 text-[#b3b3b3]">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No results found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <>
            {/* Tracks */}
            {tracks.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
                <div className="space-y-1">
                  {tracks.map((t) => {
                    const isActive = currentTrack?.uri === t.uri
                    return (
                      <div
                        key={t.id}
                        onClick={() => handlePlayTrack(t)}
                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer group ${isActive ? "bg-white/5" : ""}`}
                      >
                        <div className="relative w-10 h-10 flex-shrink-0 bg-[#282828] rounded">
                          {t.coverUrl && <Image src={t.coverUrl} alt={t.name} fill className="object-cover rounded" />}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded transition-opacity">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`truncate text-sm font-medium ${isActive ? "text-[#1DB954]" : "text-white"}`}>{t.name}</p>
                          <p className="truncate text-xs text-[#b3b3b3]">{t.artist}</p>
                        </div>
                        <span className="text-xs text-[#b3b3b3] truncate max-w-[150px] hidden sm:block">{t.album}</span>
                        <span className="text-xs text-[#b3b3b3] ml-4">{t.duration}</span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Artists */}
            {artists.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
                <div className="grid grid-cols-6 gap-4">
                  {artists.map((a) => (
                    <div key={a.id} className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer">
                      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 bg-[#282828]">
                        {a.image && <Image src={a.image} alt={a.name} fill className="object-cover" />}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{a.name}</p>
                      <p className="text-[#b3b3b3] text-xs">{a.followers} followers</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
                <div className="grid grid-cols-6 gap-4">
                  {albums.map((a) => (
                    <div key={a.id} className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer">
                      <div className="relative w-full aspect-square rounded overflow-hidden mb-3 bg-[#282828]">
                        {a.image && <Image src={a.image} alt={a.name} fill className="object-cover" />}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{a.name}</p>
                      <p className="text-[#b3b3b3] text-xs truncate">{a.year} · {a.artist}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
