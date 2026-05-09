/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@distube/ytdl-core", "yt-search"],
  allowedDevOrigins: ["127.0.0.1"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.scdn.co' },
      { protocol: 'https', hostname: '*.spotifycdn.com' },
    ],
  },
}

export default nextConfig
