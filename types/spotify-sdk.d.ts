interface SpotifyWebPlaybackTrack {
  uri: string
  name: string
  artists: Array<{ name: string; uri: string }>
  album: { name: string; images: Array<{ url: string; height: number; width: number }> }
  duration_ms: number
  is_playable: boolean
}

interface SpotifyWebPlaybackState {
  context: { uri: string; metadata: Record<string, unknown> }
  paused: boolean
  position: number
  duration: number
  track_window: {
    current_track: SpotifyWebPlaybackTrack
    previous_tracks: SpotifyWebPlaybackTrack[]
    next_tracks: SpotifyWebPlaybackTrack[]
  }
  shuffle: boolean
  repeat_mode: 0 | 1 | 2
  timestamp: number
}

interface SpotifyPlayer {
  connect(): Promise<boolean>
  disconnect(): void
  getCurrentState(): Promise<SpotifyWebPlaybackState | null>
  setVolume(v: number): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  seek(positionMs: number): Promise<void>
  nextTrack(): Promise<void>
  previousTrack(): Promise<void>
  addListener(event: "ready", cb: (data: { device_id: string }) => void): boolean
  addListener(event: "not_ready", cb: (data: { device_id: string }) => void): boolean
  addListener(event: "player_state_changed", cb: (state: SpotifyWebPlaybackState | null) => void): boolean
  addListener(event: "autoplay_failed", cb: () => void): boolean
  addListener(event: "initialization_error" | "authentication_error" | "account_error" | "playback_error", cb: (data: { message: string }) => void): boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener(event: string, cb?: (data: any) => void): boolean
}

interface Window {
  Spotify: {
    Player: new (options: {
      name: string
      getOAuthToken: (cb: (token: string) => void) => void
      volume?: number
    }) => SpotifyPlayer
  }
  onSpotifyWebPlaybackSDKReady: () => void
}
