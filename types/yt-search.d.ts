declare module "yt-search" {
  interface VideoResult {
    videoId: string
    url: string
    title: string
    description: string
    image: string
    thumbnail: string
    seconds: number
    timestamp: string
    duration: { seconds: number; timestamp: string }
    ago: string
    views: number
    author: { name: string; url: string }
  }

  interface SearchResult {
    videos: VideoResult[]
  }

  function ytSearch(query: string): Promise<SearchResult>
  export = ytSearch
}
