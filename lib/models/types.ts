import { Types } from 'mongoose'

export interface ITrace {
  _id: string
  slug: string
  name: string
  description: string
  price: number
  features: string[]
  coverImage?: string
  avatar?: string
  tags: string[]
  createdBy: IMember
  members: string[]
  moderators: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IMember {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

export interface TraceStats {
  memberCount: number
  tradeAlertCount: number
  messageCount: number
  totalTrades: number
  winRate: number
  profitFactor: number
  averageRR: number
  totalPnL: number
  bestTrade: number
  worstTrade: number
  averageDuration: string
}

export interface PerformanceMetrics {
  daily: {
    trades: number
    pnl: number
    winRate: number
  }
  weekly: {
    trades: number
    pnl: number
    winRate: number
  }
  monthly: {
    trades: number
    pnl: number
    winRate: number
  }
}

export interface ITracePosition {
  _id?: string
  id?: string
  traceId: string
  userId: string
  symbol: string
  type: 'long' | 'short'
  entry: number
  current: number
  size: number
  pnl: number
  pnlPercentage: number
  status: 'open' | 'closed'
}

export interface ITraceAlert {
  _id?: string
  id?: string
  traceId: string
  userId: string
  symbol: string
  type: string
  price: number
  status: 'active' | 'triggered' | 'cancelled'
  direction?: string
  createdAt: Date
  updatedAt: Date
} 