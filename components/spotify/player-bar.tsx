"use client"

import { TRACKS } from "@/lib/music-data"
import { usePlayer } from "@/lib/player-context"
import {
    ListMusic,
    Mic2,
    MonitorSpeaker,
    Pause,
    Play,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
} from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

function fmt(sec: number): string {
  if (!isFinite(sec) || isNaN(sec)) return "0:00"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isDeviceReady,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    changeVolume,
    skipNext,
    skipPrev,
  } = usePlayer()

  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const display = currentTrack ?? TRACKS[0]
  const showConnecting = !isDeviceReady && !currentTrack

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current
    if (!bar || duration === 0) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    seek(ratio * duration)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = volumeRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    changeVolume(ratio)
  }

  return (
    <div className="bg-black border-t border-[#282828]">
      {showConnecting && (
        <div className="flex items-center justify-center gap-2 py-1.5 bg-[#1a1a1a] text-xs text-[#b3b3b3]">
          <svg className="w-3 h-3 animate-spin text-[#1DB954]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
          Connecting to Spotify player…
        </div>
      )}
    {/* Mobile Player Bar */}
    <div className="md:hidden flex items-center gap-3 px-3 py-2">
      <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden relative">
        <Image src={display.coverUrl} alt={display.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{display.title}</p>
        <p className="text-[10px] text-[#b3b3b3] truncate">{display.artist}</p>
      </div>
      <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center text-white">
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
        ) : isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current" />
        )}
      </button>
    </div>

    {/* Desktop Player Bar */}
    <div className="hidden md:flex h-[90px] px-4 items-center justify-between">
      {/* Currently Playing */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 rounded flex-shrink-0 overflow-hidden relative">
          <Image
            src={display.coverUrl}
            alt={display.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
            {display.title}
          </p>
          <p className="text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer flex items-center gap-1.5">
            {isPlaying && (
              <span className="inline-block w-2 h-2 rounded-full bg-[#1DB954] flex-shrink-0" />
            )}
            {display.artist}
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center gap-1 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-5">
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={skipPrev}
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={skipNext}
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] text-[#b3b3b3] w-10 text-right font-medium">
            {fmt(currentTime)}
          </span>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors pointer-events-none"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
          <span className="text-[11px] text-[#b3b3b3] w-10 font-medium">
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Volume & Other Controls */}
      <div className="flex items-center gap-3 w-[30%] justify-end">
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.196 8 6 5v6l5.196-3z" />
            <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z" />
          </svg>
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeVolume(volume > 0 ? 0 : 0.75)}
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <div
            ref={volumeRef}
            onClick={handleVolumeClick}
            className="w-24 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer"
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors pointer-events-none"
              style={{ width: `${volume * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
