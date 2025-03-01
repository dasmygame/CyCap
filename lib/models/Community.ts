import mongoose from 'mongoose'

export interface ICommunity extends mongoose.Document {
  name: string
  description: string
  avatar: string
  members: mongoose.Types.ObjectId[]
  moderators: mongoose.Types.ObjectId[]
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Community description is required'],
    trim: true,
  },
  avatar: {
    type: String,
    default: '/default-community.png',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

// Virtual for member count
communitySchema.virtual('memberCount').get(function() {
  return this.members.length
})

// Ensure creator is also a moderator
communitySchema.pre('save', function(next) {
  if (this.isNew) {
    if (!this.moderators.includes(this.createdBy)) {
      this.moderators.push(this.createdBy)
    }
    if (!this.members.includes(this.createdBy)) {
      this.members.push(this.createdBy)
    }
  }
  next()
})

export default mongoose.models.Community || mongoose.model<ICommunity>('Community', communitySchema) 