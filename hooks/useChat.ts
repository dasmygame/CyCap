import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/lib/pusher'
import type { Channel } from 'pusher-js'

interface Message {
  id: string
  content: string
  type: 'text' | 'trade_alert'
  senderId: string
  sender?: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  createdAt: string
}

interface UseChatProps {
  channelId: string
}

const MESSAGES_PER_PAGE = 50

export function useChat({ channelId }: UseChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<Channel | null>(null)

  // Function to format message with sender info
  const formatMessage = (msg: Partial<Message> & { timestamp?: number }): Message => ({
    ...msg,
    id: msg.id || Date.now().toString(),
    content: msg.content || '',
    type: msg.type || 'text',
    senderId: msg.senderId || '',
    createdAt: msg.createdAt || new Date(msg.timestamp || Date.now()).toISOString(),
    sender: msg.sender || {
      id: msg.senderId || '',
      firstName: 'Unknown',
      lastName: 'User',
      username: msg.senderId || ''
    }
  })

  // Function to add message without duplicates
  const addMessage = (message: Message) => {
    setMessages(current => {
      // Check if message already exists
      if (current.some(msg => msg.id === message.id)) {
        return current
      }
      return [...current, message]
    })
  }

  // Function to fetch messages
  const fetchMessages = async (cursor?: string) => {
    try {
      console.log('Fetching messages for channel:', channelId, 'cursor:', cursor)
      const url = new URL('/api/chat', window.location.origin)
      url.searchParams.append('channelId', channelId)
      url.searchParams.append('limit', MESSAGES_PER_PAGE.toString())
      if (cursor) {
        url.searchParams.append('cursor', cursor)
      }

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      console.log('Fetched messages:', data)
      
      // Format messages with sender information
      const formattedMessages = data.map(formatMessage)
      
      // If we got fewer messages than the limit, we've reached the end
      setHasMore(data.length === MESSAGES_PER_PAGE)
      
      // If this is the initial load, replace messages
      // If this is loading more, append to existing messages
      if (cursor) {
        setMessages(current => [...formattedMessages.reverse(), ...current])
      } else {
        setMessages(formattedMessages.reverse())
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isLoadingMore || !hasMore) return

    const container = chatContainerRef.current
    const isNearTop = container.scrollTop < 100 // Load more when within 100px of top

    if (isNearTop) {
      setIsLoadingMore(true)
      const oldestMessage = messages[0]
      if (oldestMessage) {
        fetchMessages(oldestMessage.id)
      }
    }
  }, [messages, isLoadingMore, hasMore, channelId])

  useEffect(() => {
    // Initial fetch
    fetchMessages()

    if (!pusherClient) {
      console.error('Pusher client not initialized')
      return
    }

    // Subscribe to channel
    console.log('Subscribing to Pusher channel:', channelId)
    try {
      channelRef.current = pusherClient.subscribe(channelId)
      setIsConnected(true)
      
      // Listen for new messages
      channelRef.current.bind('chat:message', (message: Message) => {
        console.log('Received new message via Pusher:', message)
        const formattedMessage = formatMessage(message)
        addMessage(formattedMessage)
      })

      // Debug Pusher connection
      pusherClient.connection.bind('state_change', (states: { current: string }) => {
        console.log('Pusher connection state:', states.current)
      })

      pusherClient.connection.bind('error', (error: Error) => {
        console.error('Pusher connection error:', error)
        setIsConnected(false)
      })
    } catch (error) {
      console.error('Error subscribing to Pusher channel:', error)
      setIsConnected(false)
    }

    return () => {
      console.log('Cleaning up Pusher subscription for channel:', channelId)
      if (channelRef.current && pusherClient) {
        channelRef.current.unbind_all()
        pusherClient.unsubscribe(channelId)
      }
      setIsConnected(false)
    }
  }, [channelId])

  // Add scroll event listener
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const sendMessage = async (content: string) => {
    if (!session?.user) {
      throw new Error('You must be logged in to send messages')
    }

    try {
      // Send the message to the server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          content,
          type: 'text',
          sender: {
            id: session.user.id,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            username: session.user.username,
            avatarUrl: session.user.avatarUrl
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      console.log('Message sent successfully:', data)

      // Add the message to the UI
      const formattedMessage = formatMessage(data)
      addMessage(formattedMessage)

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  return {
    messages,
    sendMessage,
    isConnected,
    isLoadingMore,
    chatContainerRef,
  }
} 