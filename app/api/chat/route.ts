import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Message } from '@/lib/models/Message'
import { User } from '@/lib/models/User'
import { pusherServer } from '@/lib/pusher'
import { storeMessage as redisStoreMessage, getRecentMessages as redisGetMessages, ChatMessage } from '@/lib/redis'
import { Types } from 'mongoose'

interface MessageQuery {
  channelId: string
  _id?: { $lt: string }
}

interface MessageDocument {
  _id: Types.ObjectId
  channelId: string
  content: string
  type: 'text' | 'trade_alert'
  senderId: string
  sender: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  createdAt: Date
}

interface FormattedMessage {
  id: string
  channelId: string
  content: string
  type: 'text' | 'trade_alert'
  senderId: string
  sender: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  createdAt: Date
}

interface CachedMessage extends ChatMessage {
  sender?: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
}

interface UserDocument {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!channelId) {
      return new NextResponse('Missing channelId', { status: 400 })
    }

    await connectDB()

    // Try to get messages from Redis first
    const cachedMessages = await redisGetMessages(channelId, limit)
    
    if (cachedMessages.length > 0) {
      // Look up user information for each message
      const userIds = Array.from(new Set(cachedMessages.map(msg => msg.senderId)))
      const users = await User.find({ _id: { $in: userIds } }).lean<UserDocument[]>()
      const userMap = new Map(users.map(user => [user._id.toString(), user]))

      const messagesWithSenders = cachedMessages.map(msg => ({
        ...msg,
        sender: userMap.get(msg.senderId) ? {
          id: msg.senderId,
          firstName: userMap.get(msg.senderId)?.firstName || 'Unknown',
          lastName: userMap.get(msg.senderId)?.lastName || 'User',
          username: userMap.get(msg.senderId)?.username || msg.senderId,
          avatarUrl: userMap.get(msg.senderId)?.avatarUrl
        } : {
          id: msg.senderId,
          firstName: 'Unknown',
          lastName: 'User',
          username: msg.senderId,
          avatarUrl: undefined
        }
      }))

      console.log('Using cached messages with resolved users')
      return NextResponse.json(messagesWithSenders)
    }

    console.log('Fetching messages from MongoDB')

    // If not in Redis, get from MongoDB
    const query: MessageQuery = { channelId }
    if (cursor) {
      query._id = { $lt: cursor }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<MessageDocument[]>()

    console.log('Found messages:', messages.length)

    // Look up user information for each message
    const userIds = Array.from(new Set(messages.map(msg => msg.senderId)))
    const users = await User.find({ _id: { $in: userIds } }).lean<UserDocument[]>()
    const userMap = new Map(users.map(user => [user._id.toString(), user]))

    // Format messages with user information
    const formattedMessages: FormattedMessage[] = messages.map(msg => ({
      id: msg._id.toString(),
      channelId: msg.channelId,
      content: msg.content,
      type: msg.type,
      senderId: msg.senderId,
      sender: userMap.get(msg.senderId) ? {
        id: msg.senderId,
        firstName: userMap.get(msg.senderId)?.firstName || 'Unknown',
        lastName: userMap.get(msg.senderId)?.lastName || 'User',
        username: userMap.get(msg.senderId)?.username || msg.senderId,
        avatarUrl: userMap.get(msg.senderId)?.avatarUrl
      } : {
        id: msg.senderId,
        firstName: 'Unknown',
        lastName: 'User',
        username: msg.senderId,
        avatarUrl: undefined
      },
      createdAt: msg.createdAt
    }))

    // Cache messages in Redis
    if (formattedMessages.length > 0 && !cursor) {
      console.log('Caching messages in Redis')
      for (const msg of formattedMessages) {
        const redisMessage: ChatMessage = {
          id: msg.id,
          senderId: msg.senderId,
          content: msg.content,
          channelId: msg.channelId,
          timestamp: msg.createdAt.getTime(),
          type: msg.type,
          sender: msg.sender
        }
        await redisStoreMessage(channelId, redisMessage)
      }
    }

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error('[CHAT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { channelId, content, type = 'text', sender } = body

    if (!channelId || !content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    await connectDB()

    // Get the latest user data from the database
    const user = await User.findById(session.user.id).lean<UserDocument>()
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Create and save message to MongoDB with sender information
    const message = await Message.create({
      channelId,
      content,
      type,
      senderId: user._id.toString(),
      sender: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl
      }
    })

    // Format message for Redis and Pusher
    const messageData: FormattedMessage = {
      id: message._id.toString(),
      channelId,
      content,
      type,
      senderId: user._id.toString(),
      sender: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl
      },
      createdAt: message.createdAt
    }

    // Store in Redis
    const redisMessage: ChatMessage = {
      id: messageData.id,
      senderId: messageData.senderId,
      content: messageData.content,
      channelId: messageData.channelId,
      timestamp: messageData.createdAt.getTime(),
      type: messageData.type,
      sender: messageData.sender
    }

    await redisStoreMessage(channelId, redisMessage)

    // Broadcast via Pusher
    await pusherServer.trigger(channelId, 'chat:message', messageData)

    return NextResponse.json(messageData)
  } catch (error) {
    console.error('[CHAT_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 