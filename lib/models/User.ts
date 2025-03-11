import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// Interface for social media account details
interface SocialAccount {
  username: string          // Username on the platform
  profileUrl: string       // Profile URL
  verified: boolean        // Whether the account is verified
  connectedAt: Date       // When the account was connected
  lastVerified: Date      // Last verification date
}

// Interface defining the User document structure
export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  image?: string
  bio?: string
  avatarUrl?: string
  // Social media links with verification
  social: {
    twitter?: SocialAccount
    linkedin?: SocialAccount
    tradingview?: SocialAccount
  }
  // Notification preferences
  notifications: {
    emailNotifications: boolean
    tradeAlerts: boolean
    communityUpdates: boolean
    marketNews: boolean
  }
  // Required user information
  username: string
  password: string
  birthDate: Date
  age: number
  phoneNumber: string
  occupation: string
  annualIncome: string
  // Connected trading accounts
  connectedBrokers: {
    provider: string
    accountId: string
    accountType: string
    connected: boolean
  }[]
  // SnapTrade Integration
  snapTrade?: {
    userId: string
    userSecret: string
    registeredAt: Date
    brokerConnections: {
      accountId: string
      authorizationId: string
      brokerName: string
      accountName: string
      status: string
    }[]
  }
  // Timestamps
  createdAt: Date
  updatedAt: Date
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Schema definition with nested objects for social, notifications, and brokers
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  bio: String,
  avatarUrl: String,
  
  // Social media links with verification status
  social: {
    twitter: {
      username: { type: String, default: '' },
      profileUrl: { type: String, default: '' },
      verified: { type: Boolean, default: false },
      connectedAt: { type: Date, default: null },
      lastVerified: { type: Date, default: null },
      _id: false
    },
    linkedin: {
      username: { type: String, default: '' },
      profileUrl: { type: String, default: '' },
      verified: { type: Boolean, default: false },
      connectedAt: { type: Date, default: null },
      lastVerified: { type: Date, default: null },
      _id: false
    },
    tradingview: {
      username: { type: String, default: '' },
      profileUrl: { type: String, default: '' },
      verified: { type: Boolean, default: false },
      connectedAt: { type: Date, default: null },
      lastVerified: { type: Date, default: null },
      _id: false
    },
    _id: false
  },
  
  // Notification preferences with default values
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    tradeAlerts: { type: Boolean, default: true },
    communityUpdates: { type: Boolean, default: true },
    marketNews: { type: Boolean, default: false },
  },
  
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  birthDate: {
    type: Date,
    required: [true, 'Please provide your birth date'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'You must be at least 18 years old'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Please provide your occupation'],
    trim: true,
  },
  annualIncome: {
    type: String,
    required: [true, 'Please provide your annual income'],
    trim: true,
  },
  
  // Connected trading accounts - empty array by default
  connectedBrokers: [{
    provider: String,
    accountId: String,
    accountType: String,
    connected: { type: Boolean, default: false },
  }],
  
  // SnapTrade Integration
  snapTrade: {
    userId: String,
    userSecret: String,
    registeredAt: Date,
    brokerConnections: [{
      accountId: String,
      authorizationId: { type: String, required: true },
      brokerName: String,
      accountName: String,
      status: String,
      _id: false
    }],
    _id: false
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User 