import mongoose from 'mongoose'

export interface IPosition extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  symbol: string
  shares: number
  averagePrice: number
  currentPrice: number
  profitLoss: number
  profitLossPercentage: number
  createdAt: Date
  updatedAt: Date
}

const positionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    trim: true,
  },
  shares: {
    type: Number,
    required: [true, 'Number of shares is required'],
    min: [0, 'Number of shares cannot be negative'],
  },
  averagePrice: {
    type: Number,
    required: [true, 'Average price is required'],
    min: [0, 'Average price cannot be negative'],
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Current price cannot be negative'],
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  profitLossPercentage: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
})

// Calculate profit/loss before saving
positionSchema.pre('save', function(next) {
  if (this.isModified('shares') || this.isModified('averagePrice') || this.isModified('currentPrice')) {
    const totalCost = this.shares * this.averagePrice
    const currentValue = this.shares * this.currentPrice
    this.profitLoss = currentValue - totalCost
    this.profitLossPercentage = ((currentValue / totalCost) - 1) * 100
  }
  next()
})

export default mongoose.models.Position || mongoose.model<IPosition>('Position', positionSchema) 