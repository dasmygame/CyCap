import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { storeMessage, getRecentMessages, ChatMessage } from '@/lib/redis'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')

    if (!channelId) {
      return new Response('Channel ID is required', { status: 400 })
    }

    // Upgrade the HTTP request to a WebSocket connection
    if (req.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected websocket', { status: 426 })
    }

    const { socket: client, response } = Deno.upgradeWebSocket(req)

    client.onopen = () => {
      console.log('Client connected')
      
      // Send recent messages when client connects
      getRecentMessages(channelId).then(messages => {
        client.send(JSON.stringify({
          type: 'recent_messages',
          data: messages
        }))
      })
    }

    client.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'message') {
          const message: ChatMessage = {
            id: crypto.randomUUID(),
            senderId: session.user.id,
            content: data.content,
            channelId,
            timestamp: Date.now(),
            type: data.messageType || 'text'
          }

          // Store message in Redis
          await storeMessage(channelId, message)

          // Broadcast to all clients in the channel
          client.send(JSON.stringify({
            type: 'new_message',
            data: message
          }))
        }
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }

    client.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    client.onclose = () => {
      console.log('Client disconnected')
    }

    return response

  } catch (error) {
    console.error('WebSocket connection error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 