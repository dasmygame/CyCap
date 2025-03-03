import mongoose, { Schema, Document } from 'mongoose'

export interface ITrace extends Document {
  name: string
  slug: string
  description: string
  createdBy: mongoose.Types.ObjectId
  avatar?: string
  coverImage?: string
  members: mongoose.Types.ObjectId[]
  moderators: mongoose.Types.ObjectId[]
  isPublic: boolean
  tags: string[]
  stats: {
    memberCount: number
    messageCount: number
    tradeAlertCount: number
  }
  settings: {
    allowTradeAlerts: boolean
    allowChat: boolean
    requireModApproval: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const TraceSchema = new Schema<ITrace>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: { type: String },
  coverImage: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  tags: [{ type: String }],
  stats: {
    memberCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    tradeAlertCount: { type: Number, default: 0 }
  },
  settings: {
    allowTradeAlerts: { type: Boolean, default: true },
    allowChat: { type: Boolean, default: true },
    requireModApproval: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

// Create indexes
TraceSchema.index({ name: 'text', description: 'text' })
TraceSchema.index({ tags: 1 })

// Ensure slug is URL-friendly
TraceSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }
  next()
})

export const Trace = mongoose.models.Trace || mongoose.model<ITrace>('Trace', TraceSchema) 