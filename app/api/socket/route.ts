import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRecentMessages, storeMessage } from '@/lib/redis'
import type { ChatMessage } from '@/lib/redis'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  const customReadable = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('event: connected\ndata: true\n\n'))

      // Keep the connection alive with a heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode('event: ping\ndata: true\n\n'))
      }, 30000)

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        controller.close()
      })
    }
  })

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ChatMessage
    await storeMessage(body.channelId, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling message:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
} 