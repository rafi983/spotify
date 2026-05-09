export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? ""

// Works whether the user added localhost or 127.0.0.1 in the Spotify dashboard
function getRedirectUri() {
  return `${location.origin}/callback`
}

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read",
  "user-follow-read",
  "user-follow-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ")

function randString(len: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  return Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map((b) => chars[b % chars.length])
    .join("")
}

async function sha256base64url(plain: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain))
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export async function loginWithSpotify() {
  const verifier = randString(128)
  const challenge = await sha256base64url(verifier)
  sessionStorage.setItem("pkce_verifier", verifier)

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SCOPES,
    show_dialog: "true",
  })
  location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code: string) {
  const verifier = sessionStorage.getItem("pkce_verifier") ?? ""
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: verifier,
    }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error(json.error_description ?? "Auth failed")
  storeTokens(json)
  return json.access_token as string
}

function storeTokens(json: { access_token: string; refresh_token?: string; expires_in: number }) {
  localStorage.setItem("sp_access_token", json.access_token)
  if (json.refresh_token) localStorage.setItem("sp_refresh_token", json.refresh_token)
  localStorage.setItem("sp_token_expiry", String(Date.now() + json.expires_in * 1000))
}

export async function getAccessToken(): Promise<string | null> {
  const token = localStorage.getItem("sp_access_token")
  const expiry = Number(localStorage.getItem("sp_token_expiry") ?? 0)
  const refresh = localStorage.getItem("sp_refresh_token")

  if (!token) return null
  if (Date.now() < expiry - 60_000) return token
  if (!refresh) { logout(); return null }

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
    })
    const json = await res.json()
    if (!json.access_token) { logout(); return null }
    storeTokens(json)
    return json.access_token as string
  } catch {
    logout()
    return null
  }
}

export function logout() {
  ;["sp_access_token", "sp_refresh_token", "sp_token_expiry", "pkce_verifier"].forEach((k) =>
    localStorage.removeItem(k)
  )
}
