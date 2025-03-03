import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({
  path: resolve(process.cwd(), '.env.local')
})

import { connectDB } from '../lib/db'
import { User } from '../lib/models/User'
import { Document } from 'mongoose'

// Define the type for legacy user format
interface LegacyUser extends Document {
  name?: string
  firstName?: string
  lastName?: string
  email: string
  social?: {
    twitter?: string
    linkedin?: string
    tradingview?: string
  }
  notifications?: {
    emailNotifications?: boolean
    tradeAlerts?: boolean
    communityUpdates?: boolean
    marketNews?: boolean
  }
  connectedBrokers?: Array<{
    provider: string
    accountId: string
    accountType: string
    connected: boolean
  }>
}

// Define the type for possible updates
interface UserUpdates {
  firstName?: string
  lastName?: string
  social?: {
    twitter: string
    linkedin: string
    tradingview: string
  }
  notifications?: {
    emailNotifications: boolean
    tradeAlerts: boolean
    communityUpdates: boolean
    marketNews: boolean
  }
  connectedBrokers?: Array<{
    provider: string
    accountId: string
    accountType: string
    connected: boolean
  }>
}

async function migrateUsers() {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to database')

    // Find all users and get their full documents
    const users = await User.find({}).lean()
    console.log(`Found ${users.length} users to migrate`)
    
    if (users.length === 0) {
      console.log('No users found in the database. Please check if:')
      console.log('1. The database connection is correct')
      console.log('2. There are actually users in the database')
      process.exit(0)
    }

    // Log the first user as an example (excluding sensitive data)
    if (users[0]) {
      const {...safeUser } = users[0] as any
      console.log('Example user before migration:', JSON.stringify(safeUser, null, 2))
    }

    for (const user of (users as unknown as LegacyUser[])) {
      const updates: UserUpdates = {}
      console.log(`\nProcessing user: ${user.email}`)

      // Split name into firstName and lastName if needed
      if (user.name && (!user.firstName || !user.lastName)) {
        const nameParts = user.name.split(' ')
        updates.firstName = nameParts[0] || 'Unknown'
        updates.lastName = nameParts.slice(1).join(' ') || 'Unknown'
        console.log('Will update name:', { firstName: updates.firstName, lastName: updates.lastName })
      }

      // Initialize social object if it doesn't exist
      if (!user.social) {
        updates.social = {
          twitter: '',
          linkedin: '',
          tradingview: ''
        }
        console.log('Will add social links structure')
      }

      // Initialize notifications object if it doesn't exist
      if (!user.notifications) {
        updates.notifications = {
          emailNotifications: true,
          tradeAlerts: true,
          communityUpdates: true,
          marketNews: false
        }
        console.log('Will add notifications structure')
      }

      // Initialize connectedBrokers array if it doesn't exist
      if (!user.connectedBrokers) {
        updates.connectedBrokers = []
        console.log('Will add connectedBrokers structure')
      }

      // Only update if there are changes to make
      if (Object.keys(updates).length > 0) {
        console.log('Applying updates:', JSON.stringify(updates, null, 2))
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $set: updates },
          { new: true, lean: true }
        )
        if (updatedUser) {
          const {...safeUpdatedUser } = updatedUser
          console.log('User after update:', JSON.stringify(safeUpdatedUser, null, 2))
        } else {
          console.log('Warning: User not found after update')
        }
      } else {
        console.log('No updates needed for this user')
      }
    }

    // Verify the changes
    console.log('\nVerifying changes...')
    const verifyUsers = await User.find({}).lean()
    if (verifyUsers[0]) {
      const {...safeUser } = verifyUsers[0]
      console.log('Example user after migration:', JSON.stringify(safeUser, null, 2))
    }

    console.log('\nMigration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateUsers() 