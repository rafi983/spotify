"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { exchangeCodeForToken } from "@/lib/spotify-auth"

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const err = params.get("error")

    if (err) { setError(err); return }
    if (!code) { setError("No code returned from Spotify"); return }

    exchangeCodeForToken(code)
      .then(() => router.replace("/"))
      .catch((e: Error) => setError(e.message))
  }, [router])

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <p className="text-red-400">Auth error: {error}</p>
        <button onClick={() => router.replace("/")} className="text-[#1DB954] underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <svg className="w-10 h-10 animate-spin text-[#1DB954]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
      </svg>
      <p className="text-[#b3b3b3]">Connecting to Spotify…</p>
    </div>
  )
}
