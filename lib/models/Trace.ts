import mongoose from 'mongoose'

export interface ITrace extends mongoose.Document {
  slug: string
  name: string
  description?: string
  avatar?: string
  coverImage?: string
  tags: string[]
  createdBy: mongoose.Types.ObjectId | {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  members: Array<mongoose.Types.ObjectId | {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }>
  moderators: Array<mongoose.Types.ObjectId | {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }>
  createdAt: Date
  updatedAt: Date
}

const traceSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  avatar: String,
  coverImage: String,
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Create indexes
traceSchema.index({ name: 'text', description: 'text' })
traceSchema.index({ tags: 1 })

// Ensure slug is URL-friendly
traceSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }
  next()
})

export const Trace = mongoose.models.Trace || mongoose.model<ITrace>('Trace', traceSchema) 