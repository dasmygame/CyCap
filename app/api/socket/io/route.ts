import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import { NextApiResponseServerIO } from '@/types/next'
import { getRecentMessages, storeMessage } from '@/lib/redis'
import type { ChatMessage } from '@/lib/redis'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    io.on('connection', (socket) => {
      socket.on('chat:join', async (channelId: string) => {
        socket.join(channelId)
        const messages = await getRecentMessages(channelId)
        socket.emit(`chat:messages:${channelId}`, messages)
      })

      socket.on('chat:leave', (channelId: string) => {
        socket.leave(channelId)
      })

      socket.on('chat:message', async (message: ChatMessage) => {
        await storeMessage(message.channelId, message)
        io.to(message.channelId).emit(`chat:message:${message.channelId}`, message)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler 