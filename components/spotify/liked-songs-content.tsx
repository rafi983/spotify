"use client"

import { ChevronLeft, ChevronRight, ChevronDown, Play, Shuffle, Download, MoreHorizontal, Search, Heart, Clock } from "lucide-react"
import Image from "next/image"

const songs = [
  { id: 1, title: "The Night we met", artist: "Lord Huron", album: "Play It Safe", duration: "2:12", isPlaying: true, isLiked: true },
  { id: 2, title: "Akpoaza", artist: "Dynamites", album: "In the Shape of a Dream", duration: "2:12", isLiked: false },
  { id: 3, title: "Be Alright", artist: "Dean lewis", album: "Free Spirit", duration: "3:02", isLiked: true },
  { id: 4, title: "Falling", artist: "Trevor Daniel", album: "Vacation", duration: "4:25", isLiked: true },
  { id: 5, title: "If the world was ending", artist: "JP SAXE, Julia Michaels", album: "Same Old", duration: "2:56", isLiked: true },
  { id: 6, title: "Let her go", artist: "Passenger", album: "A Moment Apart", duration: "3:54", isLiked: false },
  { id: 7, title: "Another Love", artist: "Tom Odell", album: "1993", duration: "3:13", isLiked: false },
  { id: 8, title: "Sleepless Nights (fea...", artist: "ayokay, Nightly", album: "In the Shape of a Dream", duration: "2:12", isLiked: true },
  { id: 9, title: "Atlantis", artist: "Seafret", album: "Girl, I Know", duration: "3:14", isLiked: true },
  { id: 10, title: "Slow Grenade", artist: "Ellie Goulding, Lauv", album: "Brightest Blue", duration: "3:37", isLiked: true },
  { id: 11, title: "Play It Safe", artist: "Julia Wolf", album: "Play It Safe", duration: "2:12", isLiked: true },
  { id: 12, title: "Ocean Front Apt.", artist: "ayokay", album: "In the Shape of a Dream", duration: "2:12", isLiked: false },
  { id: 13, title: "Free Spirit", artist: "Khalid", album: "Free Spirit", duration: "3:02", isLiked: true },
  { id: 14, title: "Remind You", artist: "FRENSHIP", album: "Vacation", duration: "4:25", isLiked: true },
  { id: 15, title: "Same Old", artist: "SHY Martin", album: "Same Old", duration: "2:56", isLiked: true },
  { id: 16, title: "A Moment Apart", artist: "ODESZA", album: "A Moment Apart", duration: "3:54", isLiked: false },
  { id: 17, title: "Run Away", artist: "Manilla Killa, outsideOUT...", album: "1993", duration: "3:13", isLiked: false },
  { id: 18, title: "Sleepless Nights (fea...", artist: "ayokay, Nightly", album: "In the Shape of a Dream", duration: "2:12", isLiked: true },
  { id: 19, title: "Wrong Kind Of People", artist: "Baker Grace", album: "Girl, I Know", duration: "3:14", isLiked: true },
  { id: 20, title: "Slow Grenade", artist: "Ellie Goulding, Lauv", album: "Brightest Blue", duration: "3:37", isLiked: true },
  { id: 21, title: "Play It Safe", artist: "Julia Wolf", album: "Play It Safe", duration: "2:12", isLiked: true },
  { id: 22, title: "Ocean Front Apt.", artist: "ayokay", album: "In the Shape of a Dream", duration: "2:12", isLiked: false },
  { id: 23, title: "Free Spirit", artist: "Khalid", album: "Free Spirit", duration: "3:02", isLiked: true },
  { id: 24, title: "Remind You", artist: "FRENSHIP", album: "Vacation", duration: "4:25", isLiked: true },
  { id: 25, title: "Same Old", artist: "SHY Martin", album: "Same Old", duration: "2:56", isLiked: true },
  { id: 26, title: "A Moment Apart", artist: "ODESZA", album: "A Moment Apart", duration: "3:54", isLiked: false },
  { id: 27, title: "Run Away", artist: "Manilla Killa, outsideOUT...", album: "1993", duration: "3:13", isLiked: false },
  { id: 28, title: "Sleepless Nights (fea...", artist: "ayokay, Nightly", album: "In the Shape of a Dream", duration: "2:12", isLiked: true },
  { id: 29, title: "Wrong Kind Of People", artist: "Baker Grace", album: "Girl, I Know", duration: "3:14", isLiked: true },
  { id: 30, title: "Slow Grenade", artist: "Ellie Goulding, Lauv", album: "Brightest Blue", duration: "3:37", isLiked: true },
  { id: 31, title: "Play It Safe", artist: "Julia Wolf", album: "Play It Safe", duration: "2:12", isLiked: true },
  { id: 32, title: "Ocean Front Apt.", artist: "ayokay", album: "In the Shape of a Dream", duration: "2:12", isLiked: false },
  { id: 33, title: "Free Spirit", artist: "Khalid", album: "Free Spirit", duration: "3:02", isLiked: true },
  { id: 34, title: "Remind You", artist: "FRENSHIP", album: "Vacation", duration: "4:25", isLiked: true },
]

export function LikedSongsContent() {
  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-b from-[#5038a0] via-[#3d2d7a] to-[#121212]">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-black/40 hover:bg-black/60 rounded-full py-1 px-1 pr-3 transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm">
              E
            </div>
            <span className="text-white text-sm font-semibold">Enoch Emmanuel</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Playlist Header */}
        <div className="flex items-end gap-6 p-6 pt-8">
          <div className="w-[232px] h-[232px] bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded shadow-2xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-24 h-24 fill-white text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white text-xs font-medium uppercase">Public Playlist</span>
            <h1 className="text-white text-7xl font-bold tracking-tight">Liked Songs</h1>
            <div className="flex items-center gap-1 mt-4">
              <span className="text-white font-semibold">Enoch</span>
              <span className="text-white/70 mx-1">•</span>
              <span className="text-white/70">55 Songs</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-6 pt-4">
          <div className="flex items-center gap-6">
            <button className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all">
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Shuffle className="w-8 h-8" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Download className="w-8 h-8" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 text-[#b3b3b3] hover:text-white text-sm transition-colors">
              Custom order
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] gap-4 px-4 py-2 text-[#b3b3b3] text-sm border-b border-white/10 sticky top-0 bg-[#121212]">
          <span>#</span>
          <span>TITLE</span>
          <span>ALBUM</span>
          <span>DATE ADDED</span>
          <span className="flex justify-end">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        {/* Song Rows */}
        <div className="pb-8">
          {songs.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className="grid grid-cols-[16px_minmax(200px,4fr)_minmax(150px,2fr)_minmax(100px,1fr)_minmax(50px,1fr)] gap-4 px-4 py-2 text-sm hover:bg-white/10 rounded group items-center"
            >
              <span className="text-[#b3b3b3] group-hover:hidden">{index + 1}</span>
              <Play className="w-4 h-4 text-white hidden group-hover:block fill-white" />
              
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={`https://images.unsplash.com/photo-${1500000000000 + song.id * 1000}?w=80&h=80&fit=crop`}
                    alt={song.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className={`truncate font-medium ${song.isPlaying ? "text-[#1DB954]" : "text-white"}`}>
                    {song.title}
                  </p>
                  <p className="text-[#b3b3b3] truncate text-xs">{song.artist}</p>
                </div>
              </div>
              
              <span className="text-[#b3b3b3] truncate hover:underline cursor-pointer">{song.album}</span>
              
              <span className="text-[#b3b3b3]"></span>
              
              <div className="flex items-center justify-end gap-3">
                <Heart className={`w-4 h-4 ${song.isLiked ? "fill-[#1DB954] text-[#1DB954]" : "text-transparent group-hover:text-[#b3b3b3]"}`} />
                <span className="text-[#b3b3b3]">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
