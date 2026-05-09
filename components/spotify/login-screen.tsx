"use client"

import { loginWithSpotify, SPOTIFY_CLIENT_ID } from "@/lib/spotify-auth"

export function LoginScreen() {
  const missingId = !SPOTIFY_CLIENT_ID

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black gap-8 px-6">
      {/* Spotify wordmark */}
      <svg viewBox="0 0 167 50" className="w-40 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M83.996 0.277C37.747 0.277 0.253 37.77 0.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78a5.217 5.217 0 0 1-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 0 1-6.249-3.93 5.213 5.213 0 0 1 3.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35a6.538 6.538 0 0 1 4.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 0 1 5.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 0 1 2.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
      </svg>

      {missingId ? (
        <div className="text-center max-w-sm">
          <h2 className="text-white text-2xl font-bold mb-3">Setup Required</h2>
          <p className="text-[#b3b3b3] text-sm mb-6 leading-relaxed">
            Create a free Spotify Developer App to enable playback. It takes 2 minutes.
          </p>
          <ol className="text-left text-sm text-[#b3b3b3] space-y-2 mb-6">
            <li><span className="text-white font-semibold">1.</span> Go to <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-[#1DB954] underline">developer.spotify.com/dashboard</a></li>
            <li><span className="text-white font-semibold">2.</span> Create an app → copy the <strong className="text-white">Client ID</strong></li>
            <li><span className="text-white font-semibold">3.</span> In the app settings add redirect URI:<br /><code className="text-[#1DB954]">http://localhost:3000/callback</code></li>
            <li><span className="text-white font-semibold">4.</span> Create <code className="text-white">.env.local</code> in your project root:</li>
          </ol>
          <pre className="bg-[#282828] rounded p-3 text-[#1DB954] text-xs text-left mb-6">
            NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
          </pre>
          <p className="text-[#b3b3b3] text-xs">Then restart the dev server with <code className="text-white">pnpm dev</code></p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-2">Log in to Spotify</h1>
          <p className="text-[#b3b3b3] text-sm mb-8">Premium account required for full playback</p>
          <button
            onClick={loginWithSpotify}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 px-10 rounded-full text-sm transition-colors"
          >
            Log in with Spotify
          </button>
        </div>
      )}
    </div>
  )
}
