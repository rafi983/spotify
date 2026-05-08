"use client"

import { useState } from "react"
import { LeftSidebar } from "./left-sidebar"
import { MainContent } from "./main-content"
import { SearchContent } from "./search-content"
import { LikedSongsContent } from "./liked-songs-content"
import { RightSidebar } from "./right-sidebar"
import { PlayerBar } from "./player-bar"

export type ActiveView = "home" | "search" | "liked"

export function SpotifyApp() {
  const [activeView, setActiveView] = useState<ActiveView>("home")

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Main Area */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden relative">
        <LeftSidebar activeView={activeView} onNavigate={setActiveView} />
        
        {activeView === "home" && (
          <>
            <MainContent />
            <RightSidebar />
          </>
        )}
        
        {activeView === "search" && <SearchContent />}
        
        {activeView === "liked" && <LikedSongsContent />}
      </div>
      
      {/* Player Bar */}
      <PlayerBar />
    </div>
  )
}
