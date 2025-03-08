import mongoose from 'mongoose'

export interface IUserSettings extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  traceId: mongoose.Types.ObjectId
  tradeAlerts: boolean
  chatMentions: boolean
  priceAlerts: boolean
  dailyUpdates: boolean
  createdAt: Date
  updatedAt: Date
}

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trace',
    required: true
  },
  tradeAlerts: {
    type: Boolean,
    default: true
  },
  chatMentions: {
    type: Boolean,
    default: true
  },
  priceAlerts: {
    type: Boolean,
    default: true
  },
  dailyUpdates: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Create a compound index for userId and traceId
userSettingsSchema.index({ userId: 1, traceId: 1 }, { unique: true })

export const UserSettings = mongoose.models.UserSettings || mongoose.model<IUserSettings>('UserSettings', userSettingsSchema) 