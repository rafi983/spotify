"use client"

import { usePlayer } from "@/lib/player-context"
import { getAccessToken, logout } from "@/lib/spotify-auth"
import { Heart, Home, Library, LogOut, Plus, Search, Volume2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { ActiveView } from "./spotify-app"

interface LibraryItem {
  id: string
  name: string
  type: "Playlist" | "Artist"
  subtitle?: string
  image?: string
  isLiked?: boolean
  count?: string
}

const filters = ["Playlists", "Podcasts & Shows", "Albums", "Artists"]

interface LeftSidebarProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
  onOpenPlaylist: (id: string) => void
}

export function LeftSidebar({ activeView, onNavigate, onOpenPlaylist }: LeftSidebarProps) {
  const { currentTrack, isPlaying } = usePlayer()
  const likedItem: LibraryItem = { id: "liked", name: "Liked Songs", type: "Playlist", isLiked: true }
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([likedItem])
  const [playlistNames, setPlaylistNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const token = await getAccessToken()
      if (!token) { setLoading(false); return }

      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [plRes, arRes] = await Promise.all([
          fetch("https://api.spotify.com/v1/me/playlists?limit=50", { headers }),
          fetch("https://api.spotify.com/v1/me/following?type=artist&limit=20", { headers }),
        ])

        // 403 = missing scopes — show only Liked Songs until re-auth
        if (plRes.status === 403) {
          setLoading(false)
          return
        }

        const [plData, arData] = await Promise.all([plRes.json(), arRes.json()])
        const playlists: LibraryItem[] = (plData.items ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          type: "Playlist" as const,
          subtitle: p.owner?.display_name,
          image: p.images?.[0]?.url,
        }))
        const artists: LibraryItem[] = (arData.artists?.items ?? []).map((a: any) => ({
          id: a.id,
          name: a.name,
          type: "Artist" as const,
          image: a.images?.[0]?.url,
        }))

        const liked: LibraryItem = {
          id: "liked",
          name: "Liked Songs",
          type: "Playlist",
          isLiked: true,
        }

        setLibraryItems([liked, ...playlists, ...artists])
        setPlaylistNames(playlists.map((p) => p.name))
      } catch (err) {
        console.error("[library]", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])
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
          {playlistNames.map((name, index) => (
            <button
              key={index}
              className="block w-full text-left text-[#b3b3b3] hover:text-white text-sm truncate transition-colors py-1"
            >
              {name}
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
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#b3b3b3] hover:text-white">
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => { logout(); location.reload() }}
                title="Log out"
                className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#b3b3b3] hover:text-white"
              >
                <LogOut className="w-4 h-4" />
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
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-12 h-12 rounded bg-[#282828] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#282828] rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-[#282828] rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : (
            libraryItems.map((item) => {
              const isActive = isPlaying && currentTrack && item.name === currentTrack.title
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isLiked) onNavigate("liked")
                    else if (item.type === "Playlist") onOpenPlaylist(item.id)
                  }}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors w-full text-left ${isActive ? "bg-[#1a1a1a]" : ""}`}
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
                        className={`object-cover ${item.type === "Artist" ? "rounded-full" : "rounded"}`}
                      />
                    ) : (
                      <div className={`w-12 h-12 ${item.type === "Artist" ? "rounded-full" : "rounded"} bg-[#282828]`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-[#1DB954]" : "text-white"}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-[#b3b3b3] truncate">
                      {item.type}{item.count ? ` · ${item.count}` : item.subtitle ? ` · ${item.subtitle}` : ""}
                    </p>
                  </div>
                  {isActive && <Volume2 className="w-4 h-4 text-[#1DB954] flex-shrink-0" />}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
