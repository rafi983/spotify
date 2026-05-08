"use client"

import { Home, Search, Library, Plus, Heart, Volume2 } from "lucide-react"
import Image from "next/image"
import type { ActiveView } from "./spotify-app"

const playlists = [
  "Chill Mix",
  "Insta Hits",
  "Your Top Songs 2021",
  "Mellow Songs",
  "Anime Lofi & Chillhop Music",
  "BG Afro \"Select\" Vibes",
  "Afro \"Select\" Vibes",
  "Happy Hits!",
  "Deep Focus",
  "Instrumental Study",
  "OST Compilations",
  "Nostalgia for old souled mill...",
  "Mixed Feelings",
]

const libraryItems = [
  { id: 1, name: "Liked Songs", type: "Playlist", count: "234 songs", isLiked: true },
  { id: 2, name: "Johnny Drille", type: "Artist", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { id: 3, name: "African Heat", type: "Playlist", subtitle: "Spotify", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=100&h=100&fit=crop" },
  { id: 4, name: "Moody Mix", type: "Playlist", subtitle: "Spotify", isPlaying: true, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { id: 5, name: "Playlist", subtitle: "32dj4djgllbx5kbnm23psvcumm", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop" },
  { id: 6, name: "Varsity Bars", type: "Playlist", subtitle: "Spotify", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100&h=100&fit=crop" },
  { id: 7, name: "ODUMODUBLVCK", type: "Artist", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop" },
  { id: 8, name: "Your Top Songs 2023", type: "Playlist", subtitle: "Spotify", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop" },
  { id: 9, name: "2000s HITS THROWBACKS | TOP 100 SO...", type: "Playlist", subtitle: "Filtr US", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop" },
  { id: 10, name: "Shallipopi, ODUMODUBLVCK - Cast", type: "Playlist", subtitle: "Curatorboy", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
]

const filters = ["Playlists", "Podcasts & Shows", "Albums", "Artists"]

interface LeftSidebarProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
}

export function LeftSidebar({ activeView, onNavigate }: LeftSidebarProps) {
  // Different sidebar layout for Liked Songs page
  if (activeView === "liked") {
    return (
      <div className="w-[180px] h-full flex flex-col bg-black flex-shrink-0 py-4 px-2">
        {/* Navigation */}
        <nav className="space-y-3 px-2">
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-4 w-full text-[#b3b3b3] hover:text-white transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Home</span>
          </button>
          <button 
            onClick={() => onNavigate("search")}
            className="flex items-center gap-4 w-full text-[#b3b3b3] hover:text-white transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="font-semibold">Search</span>
          </button>
          <button 
            className="flex items-center gap-4 w-full text-[#b3b3b3] hover:text-white transition-colors"
          >
            <Library className="w-6 h-6" />
            <span className="font-semibold">Your Library</span>
          </button>
        </nav>

        <div className="mt-8 space-y-3 px-2">
          <button className="flex items-center gap-4 w-full text-[#b3b3b3] hover:text-white transition-colors">
            <div className="w-6 h-6 bg-[#b3b3b3] rounded-sm flex items-center justify-center group-hover:bg-white">
              <Plus className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold">Create Playlist</span>
          </button>
          <button 
            onClick={() => onNavigate("liked")}
            className="flex items-center gap-4 w-full text-white transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded-sm flex items-center justify-center">
              <Heart className="w-3 h-3 fill-white text-white" />
            </div>
            <span className="font-semibold">Liked Songs</span>
          </button>
        </div>

        <div className="border-t border-[#282828] mt-4 pt-4" />

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-hidden">
          {playlists.map((playlist, index) => (
            <button
              key={index}
              className="block w-full text-left text-[#b3b3b3] hover:text-white text-sm truncate transition-colors py-1"
            >
              {playlist}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Default sidebar for Home and Search
  return (
    <div className="w-[280px] h-full flex flex-col gap-2 flex-shrink-0">
      {/* Navigation */}
      <div className="bg-[#121212] rounded-lg p-4">
        <nav className="space-y-4">
          <button 
            onClick={() => onNavigate("home")}
            className={`flex items-center gap-5 w-full transition-colors ${
              activeView === "home" ? "text-white" : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            <Home className="w-6 h-6" fill={activeView === "home" ? "currentColor" : "none"} />
            <span className="font-bold">Home</span>
          </button>
          <button 
            onClick={() => onNavigate("search")}
            className={`flex items-center gap-5 w-full transition-colors ${
              activeView === "search" ? "text-white" : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            <Search className="w-6 h-6" strokeWidth={activeView === "search" ? 3 : 2} />
            <span className="font-bold">Search</span>
          </button>
        </nav>
      </div>

      {/* Library */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors">
              <Library className="w-6 h-6" />
              <span className="font-bold">Your Library</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#b3b3b3] hover:text-white">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hidden">
            {filters.map((filter) => (
              <button
                key={filter}
                className="px-3 py-1.5 bg-[#232323] text-white text-sm rounded-full whitespace-nowrap hover:bg-[#2a2a2a] transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search and Recents */}
          <div className="flex items-center justify-between mt-4">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#b3b3b3] hover:text-white">
              <Search className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-[#b3b3b3] hover:text-white text-sm hover:scale-105 transition-transform">
              Recents
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Library Items */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hidden">
          {libraryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.isLiked && onNavigate("liked")}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group w-full text-left ${
                item.isPlaying ? "bg-[#1a1a1a]" : ""
              }`}
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                {item.isLiked ? (
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-white text-white" />
                  </div>
                ) : item.image ? (
                  <Image 
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-cover ${item.type === 'Artist' ? 'rounded-full' : 'rounded'}`}
                  />
                ) : (
                  <div className={`w-12 h-12 ${item.type === 'Artist' ? 'rounded-full' : 'rounded'} bg-[#282828]`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${item.isPlaying ? "text-[#1DB954]" : "text-white"}`}>
                  {item.name}
                </p>
                <p className="text-xs text-[#b3b3b3] truncate">
                  {item.type}{item.count ? ` · ${item.count}` : item.subtitle ? ` · ${item.subtitle}` : ""}
                </p>
              </div>
              {item.isPlaying && (
                <Volume2 className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
