"use client"

import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Mic2, ListMusic, MonitorSpeaker, Volume2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress] = useState(37)

  return (
    <div className="h-[90px] bg-black px-4 flex items-center justify-between border-t border-[#282828]">
      {/* Currently Playing */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 rounded flex-shrink-0 overflow-hidden relative">
          <Image 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
            alt="Before you Go"
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate hover:underline cursor-pointer">Before you Go</p>
          <p className="text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1DB954] flex-shrink-0"></span>
            Lewis Capaldi
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center gap-1 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-5">
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] text-[#b3b3b3] w-10 text-right font-medium">1:37</span>
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative">
            <div 
              className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
          <span className="text-[11px] text-[#b3b3b3] w-10 font-medium">3:55</span>
        </div>
      </div>

      {/* Volume & Other Controls */}
      <div className="flex items-center gap-3 w-[30%] justify-end">
        <button className="text-[#b3b3b3] hover:text-white transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.196 8 6 5v6l5.196-3z" />
            <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z" />
          </svg>
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <div className="w-24 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer">
            <div className="h-full w-3/4 bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
