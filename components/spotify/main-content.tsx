"use client"

import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react"
import Image from "next/image"

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

export function MainContent() {
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
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform">
              Explore Premium
            </button>
            <div className="w-8 h-8 rounded-full bg-[#535353] cursor-pointer hover:bg-[#727272] transition-colors"></div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Greeting */}
          <h1 className="text-3xl font-bold text-white mb-5">Good evening</h1>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
            {quickAccessItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded overflow-hidden transition-colors group relative"
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
                {item.hasVisualizer && (
                  <div className="mr-4 flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-[#1DB954] rounded-sm animate-pulse" style={{height: '60%'}}></span>
                    <span className="w-1 bg-[#1DB954] rounded-sm animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></span>
                    <span className="w-1 bg-[#1DB954] rounded-sm animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></span>
                  </div>
                )}
                <button className="absolute right-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105 hover:bg-[#1ed760]">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </a>
            ))}
          </div>

          {/* Made for You Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Made for Enoch</h2>
              <a href="#" className="text-sm font-bold text-[#b3b3b3] hover:text-white hover:underline">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {madeForYou.map((item) => (
                <PlaylistCard key={item.id} {...item} />
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
              {topMixes.map((item) => (
                <PlaylistCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function PlaylistCard({ name, description, image, label }: { name: string; description: string; image: string; label?: string }) {
  return (
    <a href="#" className="p-4 bg-[#181818] rounded-md hover:bg-[#282828] transition-colors group cursor-pointer">
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
        <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105 hover:bg-[#1ed760]">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>
      <h3 className="font-bold text-white mb-1 truncate">{name}</h3>
      <p className="text-sm text-[#b3b3b3] line-clamp-2">{description}</p>
    </a>
  )
}
