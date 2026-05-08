"use client"

import { X } from "lucide-react"
import Image from "next/image"

export function RightSidebar() {
  return (
    <div className="w-[320px] rounded-lg flex flex-col h-full overflow-hidden flex-shrink-0 relative">
      {/* Deep maroon/red gradient background matching album art */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #4a1c24 0%, #2a1015 30%, #121212 60%)"
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Now Playing Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-bold text-white">Moody Mix</h2>
          <button className="p-1 hover:bg-white/10 rounded-full text-[#b3b3b3] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Album Art */}
        <div className="px-4">
          <div className="aspect-square rounded-lg overflow-hidden relative shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
              alt="Moody Mix"
              fill
              className="object-cover"
            />
            {/* Overlay gradient for depth */}
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)"
              }}
            />
          </div>
        </div>

        {/* About the Artist Section */}
        <div className="p-4 flex-1 overflow-y-auto scrollbar-hidden">
          <div className="bg-[#282828] rounded-lg overflow-hidden">
            {/* Artist Image Section */}
            <div className="relative h-40 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop"
                alt="Lewis Capaldi"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282828] to-transparent" />
              <span className="absolute top-3 left-3 text-xs text-white/80">About the artist</span>
            </div>
            <div className="p-4 pt-0 -mt-8 relative z-10">
              <h3 className="font-bold text-white text-lg mb-1">Lewis Capaldi</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#b3b3b3]">33,611,524 monthly listeners</span>
                <button className="px-4 py-1.5 border border-[#727272] rounded-full text-xs font-bold text-white hover:border-white hover:scale-105 transition-all">
                  Follow
                </button>
              </div>
              <p className="text-sm text-[#b3b3b3] leading-relaxed">
                2019 oppened in the midst of capaldi finding himself plauded from seemingly every critic spannning each and every corner of the globe. with a record breaking 6...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
