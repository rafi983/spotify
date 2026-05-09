"use client"

import { PlayerProvider } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import { Heart, Home, Library, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { LeftSidebar } from "./left-sidebar"
import { LikedSongsContent } from "./liked-songs-content"
import { LoginScreen } from "./login-screen"
import { MainContent } from "./main-content"
import { PlayerBar } from "./player-bar"
import { PlaylistContent } from "./playlist-content"
import { RightSidebar } from "./right-sidebar"
import { SearchContent } from "./search-content"

export type ActiveView = "home" | "search" | "liked" | "playlist"

export function SpotifyApp() {
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)

  const handleOpenPlaylist = (id: string) => {
    setSelectedPlaylistId(id)
    setActiveView("playlist")
  }
  const [authState, setAuthState] = useState<"loading" | "ok" | "login">("loading")

  useEffect(() => {
    getAccessToken()
      .then((token) => setAuthState(token ? "ok" : "login"))
      .catch(() => setAuthState("login"))
  }, [])

  if (authState === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <svg className="w-8 h-8 animate-spin text-[#1DB954]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      </div>
    )
  }

  if (authState === "login") return <LoginScreen />

  return (
    <PlayerProvider>
    <div className="h-screen flex flex-col bg-black">
      {/* Main Area */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden relative">
        {/* Left Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <LeftSidebar activeView={activeView} onNavigate={setActiveView} onOpenPlaylist={handleOpenPlaylist} />
        </div>
        
        {activeView === "home" && (
          <>
            <MainContent onNavigate={setActiveView} />
            {/* Right Sidebar - hidden on mobile and tablet */}
            <div className="hidden xl:block">
              <RightSidebar />
            </div>
          </>
        )}
        
        {activeView === "search" && <SearchContent />}
        
        {activeView === "liked" && <LikedSongsContent />}

        {activeView === "playlist" && selectedPlaylistId && (
          <PlaylistContent playlistId={selectedPlaylistId} onBack={() => setActiveView("home")} />
        )}
      </div>
      
      {/* Player Bar */}
      <PlayerBar />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around bg-[#121212] border-t border-[#282828] py-2 px-4">
        <button onClick={() => setActiveView("home")} className={`flex flex-col items-center gap-1 ${activeView === "home" ? "text-white" : "text-[#b3b3b3]"}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setActiveView("search")} className={`flex flex-col items-center gap-1 ${activeView === "search" ? "text-white" : "text-[#b3b3b3]"}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button onClick={() => setActiveView("liked")} className={`flex flex-col items-center gap-1 ${activeView === "liked" ? "text-white" : "text-[#b3b3b3]"}`}>
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Liked</span>
        </button>
        <button onClick={() => handleOpenPlaylist("2zBszhe0nkWy3z5qKmS32I")} className={`flex flex-col items-center gap-1 ${activeView === "playlist" ? "text-white" : "text-[#b3b3b3]"}`}>
          <Library className="w-6 h-6" />
          <span className="text-[10px] font-medium">Library</span>
        </button>
      </nav>
    </div>
    </PlayerProvider>
  )
}
