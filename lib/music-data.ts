export interface Track {
  id: number
  title: string
  artist: string
  album: string
  coverUrl: string
  uri?: string
}

// ── Add / replace tracks here ────────────────────────────────────────────────
// Playback uses the Spotify Web API — just provide accurate title + artist.
// The player searches Spotify by title + artist automatically when you click play.
// coverUrl is a fallback; the real Spotify album art replaces it once playing.
// ----------------------------------------------------------------------------
export const TRACKS: Track[] = [
  {
    id: 1,
    title: "The Night We Met",
    artist: "Lord Huron",
    album: "Strange Trails",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Be Alright",
    artist: "Dean Lewis",
    album: "A Place We Knew",
    coverUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Falling",
    artist: "Trevor Daniel",
    album: "Homesick",
    coverUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Let Her Go",
    artist: "Passenger",
    album: "All the Little Lights",
    coverUrl:
      "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=200&h=200&fit=crop",
  },
]
