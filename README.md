# Spotify Web Player Clone

A full-featured Spotify Web Player built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**. Connects to your real Spotify Premium account to stream music, browse playlists, search tracks, and control playback — all from a pixel-perfect Spotify-like UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Spotify](https://img.shields.io/badge/Spotify-Premium-1DB954)

---

## Features

- **Real Spotify Playback** — Streams music via the Spotify Web Playback SDK (requires Spotify Premium)
- **OAuth PKCE Authentication** — Secure client-side auth flow with no backend/secret required
- **Live Search** — Search tracks, artists, and albums in real-time with debounced queries
- **Playlist Viewer** — Browse your playlists and see all tracks with album art, duration, and dates
- **Liked Songs** — View and play your saved/liked songs from Spotify
- **Dynamic Home Page** — Personalized greeting, your real profile name and avatar
- **Sidebar Navigation** — Your Library with playlists, liked songs, and followed artists
- **Player Bar** — Full playback controls: play/pause, skip, seek, volume, track progress
- **Right Sidebar** — Artist profile display for the currently playing track

---

## Requirements

| Requirement | Details |
|---|---|
| **Node.js** | v18.17 or later |
| **npm** | v9 or later (comes with Node.js) |
| **Spotify Premium** | Required for Web Playback SDK streaming |
| **Spotify Developer App** | Free to create at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) |
| **Modern Browser** | Chrome, Edge, or Firefox (Safari has limited Playback SDK support) |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spotify-clone.git
cd spotify-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Spotify Developer App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in:
   - **App Name**: Anything (e.g., "My Spotify Clone")
   - **Redirect URIs**: Add both:
     ```
     http://localhost:3000/callback
     http://127.0.0.1:3000/callback
     ```
   - **APIs used**: Select **Web API** and **Web Playback SDK**
4. Click **Save**
5. Copy your **Client ID** from the app settings

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Client ID:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
```

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Log In

1. Click **"Log in with Spotify"**
2. Spotify will show a permissions screen — click **Agree**
3. You'll be redirected back to the app, fully authenticated

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework will be auto-detected as **Next.js**
4. No custom build settings needed

### 3. Add Environment Variable

In your Vercel project → **Settings** → **Environment Variables**:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Your Spotify Client ID |

### 4. Update Spotify Redirect URI

In your Spotify Developer Dashboard, add your production URL as a redirect URI:

```
https://your-app-name.vercel.app/callback
```

### 5. Deploy

Click **Deploy**. Your app will be live at `https://your-app-name.vercel.app`.

---

## Project Structure

```
spotify/
├── app/
│   ├── callback/page.tsx      # OAuth callback handler
│   ├── globals.css            # Global styles (Tailwind)
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Entry point → SpotifyApp
├── components/spotify/
│   ├── spotify-app.tsx        # Main app shell, routing, auth state
│   ├── login-screen.tsx       # Spotify login screen
│   ├── main-content.tsx       # Home page with greeting & quick access
│   ├── search-content.tsx     # Live search (tracks, artists, albums)
│   ├── left-sidebar.tsx       # Library: playlists, liked songs, artists
│   ├── right-sidebar.tsx      # Currently playing artist info
│   ├── player-bar.tsx         # Bottom playback controls
│   ├── liked-songs-content.tsx# Liked/saved songs page
│   └── playlist-content.tsx   # Playlist detail & track listing
├── lib/
│   ├── spotify-auth.ts        # OAuth PKCE flow, token management
│   ├── player-context.tsx     # Spotify Web Playback SDK + React Context
│   └── music-data.ts          # Fallback track data types
├── types/
│   └── spotify-sdk.d.ts       # TypeScript types for Spotify SDK
├── next.config.mjs            # Next.js config (image domains)
├── package.json
└── tsconfig.json
```

---

## How It Works

### Authentication (OAuth 2.0 PKCE)

The app uses Spotify's **Authorization Code with PKCE** flow — no backend or client secret needed:

1. User clicks "Log in" → app generates a PKCE code verifier + challenge
2. Browser redirects to Spotify's authorization page with requested scopes
3. User approves → Spotify redirects to `/callback` with an auth code
4. App exchanges the code for an access token + refresh token
5. Tokens are stored in `localStorage`; access tokens auto-refresh when expired

**Scopes requested:**
| Scope | Purpose |
|---|---|
| `streaming` | Web Playback SDK |
| `user-read-email` | User profile |
| `user-read-private` | User profile |
| `user-read-playback-state` | Current playback info |
| `user-modify-playback-state` | Play/pause/skip controls |
| `user-library-read` | Liked/saved songs |
| `user-follow-read` | Followed artists |
| `playlist-read-private` | Private playlists |
| `playlist-read-collaborative` | Collaborative playlists |

### Music Playback

Playback uses the **Spotify Web Playback SDK** which creates a virtual device in your browser:

1. SDK loads via `<script>` tag and initializes with the access token
2. A Spotify Connect device ("Spotify Clone") is registered
3. When you click play, the app calls `PUT /v1/me/player/play` with the track's Spotify URI
4. Audio streams directly through the SDK — no YouTube, no proxies
5. Playback state (position, duration, track info) syncs via SDK event listeners

### Spotify API Endpoints Used

| Endpoint | Used For |
|---|---|
| `GET /v1/me` | User profile (name, avatar) |
| `GET /v1/me/tracks` | Liked/saved songs |
| `GET /v1/me/playlists` | User's playlists |
| `GET /v1/me/following` | Followed artists |
| `GET /v1/playlists/{id}` | Playlist metadata + tracks |
| `GET /v1/search` | Search tracks, artists, albums |
| `PUT /v1/me/player/play` | Start/resume playback |
| `PUT /v1/me/player/pause` | Pause playback |
| `POST /v1/me/player/next` | Skip to next track |
| `POST /v1/me/player/previous` | Skip to previous track |
| `PUT /v1/me/player/volume` | Set volume |
| `PUT /v1/me/player/seek` | Seek to position |

---

## Troubleshooting

### "Premium Required" error
The Spotify Web Playback SDK only works with **Spotify Premium** accounts. Free accounts can browse and search but cannot stream.

### Playlist shows 0 songs
Your token may lack `playlist-read-private`. Click the logout button (→ icon in "Your Library"), then log back in. If that doesn't work:
1. Go to [spotify.com/account/apps](https://www.spotify.com/account/apps)
2. Find your app → click **Remove Access**
3. Log back in through the app

### No sound / player not connecting
- Make sure you're using **Chrome, Edge, or Firefox** (not Safari)
- Check that no other Spotify device is actively playing
- Try refreshing the page — the SDK creates a singleton player instance

### Images not loading
The app loads images from Spotify's CDN (`*.scdn.co`, `*.spotifycdn.com`) and Unsplash. These domains are configured in `next.config.mjs`. If deploying elsewhere, ensure these domains are allowed.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI**: [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth**: Spotify OAuth 2.0 PKCE (client-side, no backend)
- **Playback**: [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)
- **API**: [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- **Deployment**: [Vercel](https://vercel.com/)

---

## License

MIT
