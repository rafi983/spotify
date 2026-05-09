"use client"

import { TRACKS } from "@/lib/music-data"
import { usePlayer } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { ChevronLeft, ChevronRight, Heart, Play } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { ActiveView } from "./spotify-app"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

interface SpotifyUser {
  name: string
  image: string
}

const quickAccessItems = [
  { id: 1, name: "Liked Songs", isLiked: true, image: null },
  { id: 2, name: "Moody Mix", hasVisualizer: true, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { id: 3, name: "2000's Mix", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop" },
  { id: 4, name: "Pop Mix", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop" },
  { id: 5, name: "2010 Mix", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop" },
  { id: 6, name: "Daily Mix 3", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
]

const madeForYou = [
  { id: 1, name: "Release Radar", description: "Catch up with new release from your fav....", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", label: "Release\nRadar" },
  { id: 2, name: "Daily Mix 1", description: "Kiss daniel, Asake, Olamide, and more", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop" },
  { id: 3, name: "Daily Mix 2", description: "Ed sheerran ,One Direction, shawn...", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=200&fit=crop" },
  { id: 4, name: "Daily Mix 4", description: "Lewis Capaldi, Alexander stewarrt,....", image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=200&h=200&fit=crop" },
  { id: 5, name: "Daily Mix 5", description: "Alec Benjamin, Olivia O'brien, John Legend...", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop" },
]

const topMixes = [
  { id: 1, name: "Afrobeats Mix", description: "Shallipopi,KHaid", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop" },
  { id: 2, name: "Christmas Mix", description: "Maverick city, Pentatonix", image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=200&h=200&fit=crop", label: "Christian Mix" },
  { id: 3, name: "Backstreet Boys", description: "Gymclass heroes....", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&h=200&fit=crop", label: "Backstreet Boys\nMix" },
  { id: 4, name: "Upbeat Mix", description: "Clean bandit, Cia, Kahlid....", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=200&fit=crop" },
  { id: 5, name: "Hip Hop Mix", description: "Kendrick lamar, Eminem, Popsmoke...", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop" },
]

export function MainContent({ onNavigate }: { onNavigate: (v: ActiveView) => void }) {
  const { play } = usePlayer()
  const [user, setUser] = useState<SpotifyUser | null>(null)

  useEffect(() => {
    ;(async () => {
      const token = await getAccessToken()
      if (!token) return
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setUser({
          name: data.display_name ?? "User",
          image: data.images?.[0]?.url ?? "",
        })
      } catch {}
    })()
  }, [])

  const firstName = user?.name?.split(" ")[0] ?? "you"

  return (
    <div className="flex-1 rounded-lg overflow-hidden relative bg-[#121212]">
      {/* Gradient background - warm brownish like Spotify */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #534340 0%, #1a1614 25%, #121212 45%)"
        }}
      />
      
      <div className="relative z-10 h-full overflow-y-auto scrollbar-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div 
            className="absolute inset-0 -z-10 transition-opacity"
            style={{
              background: "linear-gradient(180deg, rgba(83, 67, 64, 0.9) 0%, transparent 100%)"
            }}
          />
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/80 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/80 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button className="flex items-center gap-2 bg-black/70 rounded-full py-1 px-1 pr-3 hover:bg-black/90 transition-colors">
                {user.image ? (
                  <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-black">{user.name[0]}</span>
                  </div>
                )}
                <span className="text-sm font-bold text-white">{user.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Greeting */}
          <h1 className="text-3xl font-bold text-white mb-5">{getGreeting()}</h1>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
            {quickAccessItems.map((item, i) => (
              <div
                key={item.id}
                onClick={() => item.isLiked ? onNavigate("liked") : play(TRACKS[i % TRACKS.length])}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded overflow-hidden transition-colors group relative cursor-pointer"
              >
                <div className="w-12 h-12 flex-shrink-0 relative">
                  {item.isLiked ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-white text-white" />
                    </div>
                  ) : item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#282828]" />
                  )}
                </div>
                <span className="font-bold text-sm text-white flex-1">{item.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); item.isLiked ? onNavigate("liked") : play(TRACKS[i % TRACKS.length]) }}
                  className="absolute right-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105 hover:bg-[#1ed760]"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Made for You Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Made for {firstName}</h2>
              <a href="#" className="text-sm font-bold text-[#b3b3b3] hover:text-white hover:underline">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {madeForYou.map((item, i) => (
                <PlaylistCard key={item.id} {...item} onPlay={() => play(TRACKS[i % TRACKS.length])} />
              ))}
            </div>
          </section>

          {/* Your Top Mixes Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Your top mixes</h2>
              <a href="#" className="text-sm font-bold text-[#b3b3b3] hover:text-white hover:underline">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {topMixes.map((item, i) => (
                <PlaylistCard key={item.id} {...item} onPlay={() => play(TRACKS[i % TRACKS.length])} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function PlaylistCard({ name, description, image, label, onPlay }: { name: string; description: string; image: string; label?: string; onPlay: () => void }) {
  return (
    <div onClick={onPlay} className="p-4 bg-[#181818] rounded-md hover:bg-[#282828] transition-colors group cursor-pointer">
      <div className="relative mb-4">
        <div className="aspect-square rounded-md overflow-hidden shadow-lg relative bg-[#282828]">
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover"
          />
          {label && (
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-sm font-bold text-white whitespace-pre-line drop-shadow-lg">{label}</span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPlay() }}
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105 hover:bg-[#1ed760]"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>
      <h3 className="font-bold text-white mb-1 truncate">{name}</h3>
      <p className="text-sm text-[#b3b3b3] line-clamp-2">{description}</p>
    </div>
  )
}
