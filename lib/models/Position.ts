import mongoose from 'mongoose'

export interface IPosition extends mongoose.Document {
  userId: mongoose.Types.ObjectId      // Reference to the user
  symbol: string                      // Trading pair/symbol
  type: 'long' | 'short'             // Position type
  size: number                       // Position size
  entry: number                      // Entry price
  current: number                    // Current price
  status: 'open' | 'closed'         // Position status
  pnl: number                      // Current profit/loss
  pnlPercentage: number           // Profit/loss percentage
  closePrice?: number             // Price at which position was closed (if closed)
  closedAt?: Date                // When the position was closed (if closed)
  performance: {                 // Performance metrics
    maxProfit: number          // Highest profit reached
    maxLoss: number           // Largest drawdown
    peakPrice: number        // Highest price reached (for longs) or lowest (for shorts)
    duration?: number        // Duration in milliseconds (when closed)
    r?: number              // R-multiple (profit/loss relative to initial risk)
  }
  risk: {                    // Risk management
    stopLoss?: number       // Stop loss price
    takeProfit?: number    // Take profit price
    initialRisk?: number   // Initial risk amount
    riskPercentage?: number // Risk as percentage of account
  }
  metadata: {               // Additional trade metadata
    strategy?: string      // Trading strategy used
    timeframe?: string    // Trading timeframe
    setup?: string       // Trade setup type
    tags?: string[]     // Custom tags
    notes?: string      // Trade notes
  }
  createdAt: Date        // When position was opened
  updatedAt: Date       // Last update timestamp
}

const positionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: [true, 'Trading symbol is required'],
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  size: {
    type: Number,
    required: [true, 'Position size is required'],
    min: [0, 'Size cannot be negative']
  },
  entry: {
    type: Number,
    required: [true, 'Entry price is required'],
    min: [0, 'Price cannot be negative']
  },
  current: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    index: true
  },
  pnl: {
    type: Number,
    required: true
  },
  pnlPercentage: {
    type: Number,
    required: true
  },
  closePrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  closedAt: {
    type: Date
  },
  performance: {
    maxProfit: { type: Number, default: 0 },
    maxLoss: { type: Number, default: 0 },
    peakPrice: { type: Number, default: 0 },
    duration: { type: Number },
    r: { type: Number }
  },
  risk: {
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    initialRisk: { type: Number },
    riskPercentage: { type: Number }
  },
  metadata: {
    strategy: { type: String },
    timeframe: { type: String },
    setup: { type: String },
    tags: [{ type: String }],
    notes: { type: String }
  }
}, {
  timestamps: true
})

// Initialize performance and risk objects before saving if they don't exist
positionSchema.pre('save', function(next) {
  if (!this.performance) {
    this.performance = {
      maxProfit: 0,
      maxLoss: 0,
      peakPrice: this.current || 0
    }
  }
  if (!this.risk) {
    this.risk = {}
  }
  next()
})

// Calculate P&L and update performance metrics before saving
positionSchema.pre('save', function(next) {
  if (this.isModified('current') || this.isModified('entry') || this.isModified('size')) {
    const entryValue = this.size * this.entry
    const currentValue = this.size * this.current
    
    // Initialize performance object with defaults if it doesn't exist
    if (!this.performance) {
      this.performance = {
        maxProfit: 0,
        maxLoss: 0,
        peakPrice: this.current,
        duration: undefined,
        r: undefined
      }
    }
    
    // Calculate P&L based on position type
    if (this.type === 'long') {
      this.pnl = currentValue - entryValue
      this.pnlPercentage = ((currentValue / entryValue) - 1) * 100
      
      // Update peak price for long positions
      if (typeof this.performance.peakPrice === 'number') {
        this.performance.peakPrice = Math.max(this.current, this.performance.peakPrice)
      } else {
        this.performance.peakPrice = this.current
      }
    } else {
      this.pnl = entryValue - currentValue
      this.pnlPercentage = ((entryValue / currentValue) - 1) * 100
      
      // Update peak price for short positions
      if (typeof this.performance.peakPrice === 'number') {
        this.performance.peakPrice = Math.min(this.current, this.performance.peakPrice)
      } else {
        this.performance.peakPrice = this.current
      }
    }

    // Update max profit/loss
    if (typeof this.performance.maxProfit === 'number') {
      this.performance.maxProfit = Math.max(this.pnl, this.performance.maxProfit)
    } else {
      this.performance.maxProfit = this.pnl
    }

    if (typeof this.performance.maxLoss === 'number') {
      this.performance.maxLoss = Math.min(this.pnl, this.performance.maxLoss)
    } else {
      this.performance.maxLoss = this.pnl
    }

    // Initialize risk object if it doesn't exist
    if (!this.risk) {
      this.risk = {
        stopLoss: undefined,
        takeProfit: undefined,
        initialRisk: undefined,
        riskPercentage: undefined
      }
    }

    // Calculate R-multiple if stop loss and initial risk are set
    if (typeof this.risk.stopLoss === 'number' && typeof this.risk.initialRisk === 'number') {
      this.performance.r = this.pnl / this.risk.initialRisk
    }
  }
  next()
})

// Method to close position
positionSchema.methods.closePosition = async function(closePrice: number) {
  this.status = 'closed'
  this.closePrice = closePrice
  this.current = closePrice
  this.closedAt = new Date()
  
  // Initialize performance object if it doesn't exist
  if (!this.performance) {
    this.performance = {
      maxProfit: 0,
      maxLoss: 0,
      peakPrice: this.current,
      duration: undefined,
      r: undefined
    }
  }
  
  // Calculate final duration
  this.performance.duration = this.closedAt.getTime() - this.createdAt.getTime()
  
  await this.save()
}

// Method to update stop loss
positionSchema.methods.updateStopLoss = async function(newStopLoss: number) {
  // Initialize risk object if it doesn't exist
  if (!this.risk) {
    this.risk = {
      stopLoss: undefined,
      takeProfit: undefined,
      initialRisk: undefined,
      riskPercentage: undefined
    }
  }
  
  const oldStopLoss = this.risk.stopLoss
  this.risk.stopLoss = newStopLoss
  
  // Recalculate initial risk if it was previously set
  if (typeof oldStopLoss === 'number' && typeof this.risk.initialRisk === 'number') {
    const riskDiff = Math.abs(this.entry - newStopLoss)
    this.risk.initialRisk = this.size * riskDiff
  }
  
  await this.save()
}

// Add compound indexes for common queries
positionSchema.index({ userId: 1, status: 1 })
positionSchema.index({ userId: 1, symbol: 1 })
positionSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Position || mongoose.model<IPosition>('Position', positionSchema) 