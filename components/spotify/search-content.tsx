"use client"

import { Search, ChevronLeft, ChevronRight, X, ChevronRightIcon } from "lucide-react"
import Image from "next/image"

const recentSearches = [
  { id: 1, name: "Shallipoppi", type: "Artist", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop" },
  { id: 2, name: "Ed Sheeran", type: "Artist", image: "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=150&h=150&fit=crop" },
]

const topGenres = [
  { id: 1, name: "Pop", color: "#8D6748", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
  { id: 2, name: "Hip-Hop", color: "#8338EC", image: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?w=200&h=200&fit=crop" },
  { id: 3, name: "Afro", color: "#E91E8C", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop" },
]

const browseCategories = [
  { id: 1, name: "Podcasts", color: "#006450", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop" },
  { id: 2, name: "Made For You", color: "#8338EC", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop" },
  { id: 3, name: "Charts", color: "#2D4654", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop" },
  { id: 4, name: "New Releases", color: "#E13300", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&h=150&fit=crop" },
  { id: 5, name: "Discover", color: "#1E3264", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop" },
  { id: 6, name: "Concerts", color: "#0D4843", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop" },
  { id: 7, name: "R&B", color: "#8338EC", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=150&h=150&fit=crop" },
  { id: 8, name: "Frequency", color: "#1E5E55", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&h=150&fit=crop" },
  { id: 9, name: "Christian & Gospel", color: "#E13300", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=150&h=150&fit=crop" },
  { id: 10, name: "Soul", color: "#DC148C", image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=150&h=150&fit=crop" },
  { id: 11, name: "Chill", color: "#1DB954", image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=150&h=150&fit=crop" },
  { id: 12, name: "Mood", color: "#E8612A", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop" },
  { id: 13, name: "Equal", color: "#E61E32", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&h=150&fit=crop" },
  { id: 14, name: "Alternative", color: "#643CB5", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop" },
  { id: 15, name: "Workout", color: "#E91E8C", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop" },
  { id: 16, name: "Party", color: "#148A08", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=150&fit=crop" },
  { id: 17, name: "Pop", color: "#8338EC", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop" },
  { id: 18, name: "Hip-Hop", color: "#1DB954", image: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?w=150&h=150&fit=crop" },
  { id: 19, name: "Afro", color: "#1E90FF", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=150&h=150&fit=crop" },
  { id: 20, name: "Rewind", color: "#0D73EC", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&h=150&fit=crop" },
]

export function SearchContent() {
  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-[480px] mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#121212]" />
            <input
              type="text"
              placeholder="Artists, songs, or podcasts"
              className="w-full h-12 pl-12 pr-4 bg-white rounded-full text-sm text-[#121212] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-2 bg-black rounded-full py-1 px-1 pr-3 hover:bg-[#282828] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
            <span className="text-sm font-bold text-black">E</span>
          </div>
          <span className="text-sm font-bold text-white">Enoch Emmanuel</span>
          <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 6l-6 6-6-6h12z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Recent Searches */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">Recent searches</h2>
          <div className="flex gap-4">
            {recentSearches.map((item) => (
              <div
                key={item.id}
                className="relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
              >
                <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                  <X className="w-4 h-4" />
                </button>
                <div className="w-20 h-20 rounded-full overflow-hidden relative mx-auto mb-3 shadow-lg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <p className="text-white font-medium text-center">{item.name}</p>
                <p className="text-[#a7a7a7] text-sm text-center">{item.type}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your Top Genres */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">Your top genres</h2>
          <div className="relative">
            <div className="flex gap-4">
              {topGenres.map((genre) => (
                <div
                  key={genre.id}
                  className="relative flex-1 h-[220px] rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: genre.color }}
                >
                  <h3 className="absolute top-4 left-4 text-3xl font-bold text-white z-10">{genre.name}</h3>
                  <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden">
                    <Image
                      src={genre.image}
                      alt={genre.name}
                      fill
                      className="object-cover transform rotate-[25deg] translate-x-4 translate-y-4"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
              <ChevronRightIcon className="w-6 h-6 text-black" />
            </button>
          </div>
        </section>

        {/* Browse All */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-5">Browse all</h2>
          <div className="grid grid-cols-5 gap-6">
            {browseCategories.map((category) => (
              <div
                key={category.id}
                className="relative h-[180px] rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: category.color }}
              >
                <h3 className="absolute top-4 left-4 text-xl font-bold text-white z-10">{category.name}</h3>
                <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transform rotate-[25deg] translate-x-2 translate-y-2 shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
