"use client"

import { usePlayer } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { Music2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ArtistInfo {
  name: string
  followers: number
  genres: string[]
  image?: string
  isFollowing?: boolean
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

export function RightSidebar() {
  const { currentTrack } = usePlayer()
  const [artist, setArtist] = useState<ArtistInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const artistName = currentTrack?.artist
    if (!artistName) return

    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const token = await getAccessToken()
        if (!token || cancelled) return

        const headers = { Authorization: `Bearer ${token}` }

        // Search for the artist
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
          { headers }
        )
        const searchData = await searchRes.json()
        const hit = searchData.artists?.items?.[0]
        if (!hit || cancelled) return

        if (!cancelled) {
          setArtist({
            name: hit.name,
            followers: hit.followers?.total ?? -1,
            genres: (hit.genres ?? []).slice(0, 3),
            image: hit.images?.[0]?.url,
            isFollowing: false,
          })
        }
      } catch (err) {
        console.error("[artist info]", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [currentTrack?.artist])

  if (!currentTrack) {
    return (
      <div className="w-[320px] rounded-lg flex flex-col h-full overflow-hidden flex-shrink-0 bg-[#121212] items-center justify-center gap-4">
        <Music2 className="w-12 h-12 text-[#282828]" />
        <p className="text-[#b3b3b3] text-sm">Play a song to see artist info</p>
      </div>
    )
  }

  return (
    <div className="w-[320px] rounded-lg flex flex-col h-full overflow-hidden flex-shrink-0 relative">
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #1a2a1a 0%, #121212 45%)" }}
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4">
          <h2 className="font-bold text-white text-sm truncate">Now Playing</h2>
        </div>

        {/* Album Art */}
        <div className="px-4">
          <div className="aspect-square rounded-lg overflow-hidden relative shadow-2xl bg-[#282828]">
            {currentTrack.coverUrl ? (
              <Image src={currentTrack.coverUrl} alt={currentTrack.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 className="w-16 h-16 text-[#535353]" />
              </div>
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="px-4 pt-3 pb-1">
          <p className="font-bold text-white truncate">{currentTrack.title}</p>
          <p className="text-sm text-[#b3b3b3] truncate">{currentTrack.artist}</p>
        </div>

        {/* About the Artist */}
        <div className="p-4 flex-1 overflow-y-auto scrollbar-hidden">
          <div className="bg-[#282828] rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                <div className="h-36 bg-[#333] rounded animate-pulse" />
                <div className="h-4 bg-[#333] rounded animate-pulse w-1/2" />
                <div className="h-3 bg-[#333] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#333] rounded animate-pulse w-2/3" />
              </div>
            ) : artist ? (
              <>
                <div className="relative h-36 overflow-hidden">
                  {artist.image ? (
                    <Image src={artist.image} alt={artist.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full bg-[#333]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#282828] to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-bold text-white/80">About the artist</span>
                </div>
                <div className="p-4 pt-0 -mt-6 relative z-10">
                  <h3 className="font-bold text-white text-base mb-1">{artist.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    {artist.followers >= 0 && (
                      <span className="text-xs text-[#b3b3b3]">
                        {fmt(artist.followers)} followers
                      </span>
                    )}
                    <button className="px-4 py-1 border border-[#727272] rounded-full text-xs font-bold text-white hover:border-white hover:scale-105 transition-all">
                      {artist.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                  {artist.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {artist.genres.map((g) => (
                        <span key={g} className="px-2 py-0.5 bg-[#333] rounded-full text-xs text-[#b3b3b3] capitalize">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 text-sm text-[#b3b3b3]">Artist info unavailable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
