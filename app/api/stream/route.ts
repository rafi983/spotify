import ytdl from "@distube/ytdl-core"
import { type NextRequest } from "next/server"
import { Readable } from "stream"
import ytSearch from "yt-search"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    // 1. Search YouTube for the best match
    const result = await ytSearch(query)
    const video = result.videos[0]
    if (!video) {
      return new Response(JSON.stringify({ error: "No YouTube results" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 2. Fetch track info and pick the best playable format
    const info = await ytdl.getInfo(video.url)
    const all = info.formats

    // Priority: itag 140 (m4a/aac — best browser compat) → any audio-only → any with audio
    const format =
      all.find((f) => f.itag === 140) ||
      all.find((f) => f.itag === 251) ||
      all.find((f) => f.itag === 250) ||
      all.find((f) => f.itag === 249) ||
      all.find((f) => f.hasAudio && !f.hasVideo) ||
      all.find((f) => f.hasAudio)

    if (!format) {
      return new Response(JSON.stringify({ error: "No audio format found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 3. Stream the audio
    const nodeStream = ytdl.downloadFromInfo(info, { format })
    const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>

    // Use precise content type so browser knows the codec
    const contentType =
      format.itag === 140
        ? "audio/mp4"
        : format.mimeType?.split(";")[0] ?? "audio/webm"

    return new Response(webStream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (err) {
    console.error("[/api/stream] error:", err)
    return new Response(JSON.stringify({ error: "Stream failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
