import mongoose from 'mongoose'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({
  path: resolve(process.cwd(), '.env.local')
})

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

export async function connectDB() {
  try {
    const opts = {
      bufferCommands: false,
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, opts)
      console.log('Connected to MongoDB')
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
} 