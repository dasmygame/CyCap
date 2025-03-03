import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance (only used on the server)
let pusherServer: PusherServer | null = null
if (typeof window === 'undefined') {
  if (!process.env.PUSHER_APP_ID) throw new Error('PUSHER_APP_ID is not defined')
  if (!process.env.PUSHER_KEY) throw new Error('PUSHER_KEY is not defined')
  if (!process.env.PUSHER_SECRET) throw new Error('PUSHER_SECRET is not defined')
  if (!process.env.PUSHER_CLUSTER) throw new Error('PUSHER_CLUSTER is not defined')

  pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  })
}

// Client-side Pusher instance
let pusherClient: PusherClient | null = null
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY) throw new Error('NEXT_PUBLIC_PUSHER_KEY is not defined')
  if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) throw new Error('NEXT_PUBLIC_PUSHER_CLUSTER is not defined')

  pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
  })
}

// Event types for type safety
export const EVENTS = {
  MESSAGE: 'chat:message',
  TRADE_ALERT: 'trade:alert',
  TYPING: 'chat:typing',
} as const

export type ChatEvent = typeof EVENTS[keyof typeof EVENTS]

export { pusherServer, pusherClient } 