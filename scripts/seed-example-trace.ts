import { config } from 'dotenv'
import { resolve } from 'path'
import { connectDB } from '../lib/db'
import { User } from '../lib/models/User'
import { Trace } from '../lib/models/Trace'

// Load environment variables from .env.local
config({
  path: resolve(process.cwd(), '.env.local')
})

async function seedExampleTrace() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Find or create example admin user
    let adminUser = await User.findOne({ email: 'admin@traecer.com' })
    
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@traecer.com',
        username: 'admin',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        bio: 'Traecer platform administrator',
        birthDate: new Date('1990-01-01'),
        age: 34,
        phoneNumber: '+1234567890',
        occupation: 'Platform Administrator',
        annualIncome: '100000-150000',
        notifications: {
          emailNotifications: true,
          tradeAlerts: true,
          communityUpdates: true,
          marketNews: true
        },
        social: {
          twitter: {
            username: '',
            profileUrl: '',
            verified: false
          },
          linkedin: {
            username: '',
            profileUrl: '',
            verified: false
          },
          tradingview: {
            username: '',
            profileUrl: '',
            verified: false
          }
        },
        connectedBrokers: []
      })
      console.log('Created admin user')
    }

    // Create example Trace
    const exampleTrace = await Trace.findOneAndUpdate(
      { slug: 'crypto-futures-elite' },
      {
        name: 'Crypto Futures Elite',
        description: 'A community of professional crypto futures traders sharing insights and trade alerts.',
        createdBy: adminUser._id,
        avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=crypto-futures',
        coverImage: 'https://images.unsplash.com/photo-1605792657660-596af9009e82',
        members: [adminUser._id],
        moderators: [adminUser._id],
        isPublic: true,
        tags: ['crypto', 'futures', 'bitcoin', 'trading'],
        stats: {
          memberCount: 1,
          messageCount: 0,
          tradeAlertCount: 0
        },
        settings: {
          allowTradeAlerts: true,
          allowChat: true,
          requireModApproval: false
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    )

    console.log('Example Trace created/updated:', exampleTrace)
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
seedExampleTrace() 