"use client"

import { PlayerProvider } from "@/lib/player-context"
import { getAccessToken } from "@/lib/spotify-auth"
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
        <LeftSidebar activeView={activeView} onNavigate={setActiveView} onOpenPlaylist={handleOpenPlaylist} />
        
        {activeView === "home" && (
          <>
            <MainContent onNavigate={setActiveView} />
            <RightSidebar />
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
    </div>
    </PlayerProvider>
  )
}
