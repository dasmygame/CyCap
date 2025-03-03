'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/hooks/useChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface LiveChatProps {
  traceId: string
}

export function LiveChat({ traceId }: LiveChatProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const { messages, sendMessage, isConnected } = useChat({ channelId: traceId })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Sync messages from useChat with local state
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [localMessages, shouldAutoScroll])

  // Initial scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 50
    setShouldAutoScroll(isAtBottom)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim() || !session?.user) return
    
    // Create optimistic message with current user's info
    const optimisticMessage: Message = {
      id: Math.random().toString(),
      content: message.trim(),
      type: 'text',
      senderId: session.user.id,
      sender: {
        id: session.user.id,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        username: session.user.username || '',
        avatarUrl: session.user.avatarUrl
      },
      createdAt: new Date().toISOString()
    }

    try {
      // Add optimistic message to local state
      setLocalMessages(current => [...current, optimisticMessage])
      
      // Clear input and ensure we scroll to bottom
      setMessage('')
      setShouldAutoScroll(true)
      
      // Actually send the message
      const messageToSend = message.trim()
      await sendMessage(messageToSend)
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove optimistic message on error
      setLocalMessages(current => current.filter(msg => msg.id !== optimisticMessage.id))
    }
  }

  const navigateToProfile = (username?: string) => {
    if (username) {
      router.push(`/u/${username}`)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-lg font-medium">Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <ScrollArea 
          className="flex-1 px-4" 
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          <div className="space-y-4 py-4">
            {localMessages.map((msg: Message, index: number) => {
              const isOwnMessage = msg.senderId === session?.user?.id
              const isLastMessage = index === localMessages.length - 1
              const sender = msg.sender || { firstName: 'Unknown', lastName: 'User' }
              return (
                <div
                  key={msg.id}
                  ref={isLastMessage ? lastMessageRef : null}
                  className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar 
                      className="h-6 w-6 cursor-pointer" 
                      onClick={() => navigateToProfile(msg.sender?.username)}
                    >
                      {msg.sender?.avatarUrl && (
                        <AvatarImage src={msg.sender.avatarUrl} />
                      )}
                      <AvatarFallback>
                        {getInitials(msg.sender?.firstName, msg.sender?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span 
                      className="text-xs cursor-pointer hover:underline text-muted-foreground"
                      onClick={() => navigateToProfile(msg.sender?.username)}
                    >
                      {msg.sender?.firstName || 'Unknown'} {msg.sender?.lastName || 'User'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div
                      className={`rounded-lg px-3 py-2 break-words ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="flex-none p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected || !session}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!isConnected || !session}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
} 