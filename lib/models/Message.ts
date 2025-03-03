import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  channelId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'trade_alert'],
    default: 'text'
  },
  sender: {
    id: String,
    firstName: String,
    lastName: String,
    username: String,
    avatarUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Create compound index for efficient querying
messageSchema.index({ channelId: 1, createdAt: -1 })

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema) 