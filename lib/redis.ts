import { Redis } from '@upstash/redis'
import { createClient, RedisClientType } from 'redis'

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  channelId: string
  timestamp: number
  type: 'text' | 'trade_alert'
  sender?: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
}

type RedisClient = Redis | RedisClientType

let redis: RedisClient
let isUpstash = false

if (process.env.REDIS_URL?.startsWith('https://')) {
  // Use Upstash Redis in production
  redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
  })
  isUpstash = true
} else {
  // Use local Redis in development
  redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  })

  redis.connect().catch(console.error)
}

// Helper functions for chat messages
export async function storeMessage(channelId: string, message: ChatMessage) {
  const key = `chat:${channelId}:messages`
  const messageStr = JSON.stringify(message)

  try {
    if (isUpstash) {
      const upstashRedis = redis as Redis
      await upstashRedis.lpush(key, messageStr)
      await upstashRedis.ltrim(key, 0, 99) // Keep last 100 messages
    } else {
      const nodeRedis = redis as RedisClientType
      await nodeRedis.lPush(key, messageStr)
      await nodeRedis.lTrim(key, 0, 99) // Keep last 100 messages
    }
  } catch (error) {
    console.error('Error storing message in Redis:', error)
  }
}

export async function getRecentMessages(channelId: string, limit = 50): Promise<ChatMessage[]> {
  const key = `chat:${channelId}:messages`

  try {
    if (isUpstash) {
      const upstashRedis = redis as Redis
      const messages = await upstashRedis.lrange(key, 0, limit - 1)
      return messages.map(msg => JSON.parse(msg) as ChatMessage)
    } else {
      const nodeRedis = redis as RedisClientType
      const messages = await nodeRedis.lRange(key, 0, limit - 1)
      return (messages || []).map(msg => JSON.parse(msg) as ChatMessage)
    }
  } catch (error) {
    console.error('Error fetching messages from Redis:', error)
    return []
  }
}

export default redis 