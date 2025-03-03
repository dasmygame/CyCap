import mongoose from 'mongoose'

export interface ITraceAlert extends mongoose.Document {
  traceId: mongoose.Types.ObjectId   // Reference to the trace
  userId: mongoose.Types.ObjectId    // User who created the alert
  type: 'entry' | 'exit' | 'update' // Alert type
  symbol: string                    // Trading pair
  price: number                     // Price level
  direction?: 'long' | 'short'      // Trade direction (for entry alerts)
  metadata?: {                      // Optional metadata
    stopLoss?: number              // Stop loss price
    takeProfit?: number           // Take profit price
    size?: number                // Position size
    leverage?: number           // Leverage used
    tags?: string[]            // Custom tags
    notes?: string            // Additional notes
  }
  status: 'active' | 'triggered' | 'cancelled' // Alert status
  triggeredAt?: Date          // When the alert was triggered
  createdAt: Date            // When the alert was created
  updatedAt: Date           // Last update timestamp
}

const traceAlertSchema = new mongoose.Schema({
  traceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trace',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['entry', 'exit', 'update'],
    required: true
  },
  symbol: {
    type: String,
    required: [true, 'Trading symbol is required'],
    uppercase: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price level is required'],
    min: [0, 'Price cannot be negative']
  },
  direction: {
    type: String,
    enum: ['long', 'short']
  },
  metadata: {
    stopLoss: Number,
    takeProfit: Number,
    size: Number,
    leverage: Number,
    tags: [String],
    notes: String
  },
  status: {
    type: String,
    enum: ['active', 'triggered', 'cancelled'],
    default: 'active',
    required: true,
    index: true
  },
  triggeredAt: Date
}, {
  timestamps: true
})

// Add compound indexes for common queries
traceAlertSchema.index({ traceId: 1, status: 1 })
traceAlertSchema.index({ userId: 1, status: 1 })
traceAlertSchema.index({ symbol: 1, price: 1, status: 1 })

// Method to trigger alert
traceAlertSchema.methods.triggerAlert = async function() {
  this.status = 'triggered'
  this.triggeredAt = new Date()
  await this.save()
}

// Method to cancel alert
traceAlertSchema.methods.cancelAlert = async function() {
  this.status = 'cancelled'
  await this.save()
}

export default mongoose.models.TraceAlert || mongoose.model<ITraceAlert>('TraceAlert', traceAlertSchema) 