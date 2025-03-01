import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  birthDate: Date
  age: number
  phoneNumber: string
  occupation: string
  annualIncome: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
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
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error)
    } else {
      next(new Error('An unknown error occurred while hashing the password'))
    }
  }
})

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch {
    return false
  }
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema) 