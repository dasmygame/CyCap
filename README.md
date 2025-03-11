# Traecer - Trading Community Platform

Traecer is a modern trading community platform that enables traders to track their portfolios, join communities, and share insights.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - shadcn/ui (Built on Radix UI)
  - Lucide Icons
- **State Management**: React Hooks
- **Authentication**: NextAuth.js
- **Real-time**: Pusher

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Redis caching
- **ODM**: Mongoose
- **Authentication**: JWT (via NextAuth.js)
- **Real-time**: Pusher
- **Caching**: Redis

## Features

- 🔐 **Authentication**
  - Email/Password Sign Up & Sign In
  - JWT-based session management
  - Protected routes

- 📊 **Dashboard**
  - Portfolio overview
  - Real-time position tracking
  - Performance metrics
  - Community engagement

- 🔍 **Discover**
  - Browse and search traces
  - Tag-based filtering
  - Real-time updates
  - Modern, responsive interface

- 📈 **Traces**
  - Create and manage trading traces
  - Role-based permissions (owner, moderator, member)
  - Tag organization
  - Performance tracking
  - Member management

- 💬 **Live Chat**
  - Real-time messaging
  - Infinite scroll with pagination
  - Message caching with Redis
  - Optimistic updates
  - Typing indicators
  - Read receipts

- 📱 **Responsive Design**
  - Mobile-first approach
  - Dark/Light theme support
  - Smooth transitions
  - Modern UI/UX

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- Redis
- npm/yarn
- Pusher account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/traecer.git
cd traecer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Pusher configuration (Server)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Pusher configuration (Client)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

4. Start Redis server (if running locally)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
traecer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Chat endpoints
│   │   └── traces/       # Trace management endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── discover/         # Discover page
│   ├── t/               # Trace pages
│   ├── components/       # Shared components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── models/          # MongoDB models
│   ├── utils/           # Utility functions
│   │   └── permissions.ts # Role-based permissions
│   ├── pusher.ts        # Pusher configuration
│   ├── redis.ts         # Redis configuration
│   └── db.ts           # MongoDB configuration
├── hooks/               # Custom React hooks
│   └── useChat.ts      # Chat functionality hook
├── public/             # Static assets
└── types/             # TypeScript types
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/chat` - Chat endpoints (GET, POST)
- `/api/dashboard` - Dashboard data
- `/api/communities` - Community management
- `/api/positions` - Trading positions
- `/api/traces` - Trace management (CRUD operations)
- `/api/traces/[traceId]/*` - Trace-specific operations

## Permissions System

The platform implements a role-based permission system for traces:

### Roles
- **Owner**: Full control over trace settings and management
- **Moderator**: Can manage members and content
- **Member**: Can view content and create alerts
- **None**: Public access only

### Permissions by Role
- Edit trace: Owner, Moderator
- Delete trace: Owner
- Manage members: Owner, Moderator
- Manage settings: Owner
- Create alerts: Owner, Moderator, Member
- Delete alerts: Owner, Moderator
- Ban members: Owner, Moderator
- Kick members: Owner, Moderator
- Add moderators: Owner
- Remove moderators: Owner

## Chat Implementation

The chat system uses a combination of technologies for optimal performance:

### Frontend
- `useChat` hook for managing chat state and Pusher connection
- Optimistic updates for instant feedback
- Message deduplication
- Infinite scroll with cursor-based pagination
- Proper cleanup of Pusher subscriptions

### Backend
- MongoDB for message storage
- Redis for message caching
- Pusher for real-time message delivery
- Cursor-based pagination (50 messages per page)

### Environment Setup
Ensure all required environment variables are set:
- Pusher configuration (both server and client)
- Redis configuration
- MongoDB connection string

## SnapTrade Integration

The platform integrates with SnapTrade to enable users to connect and manage their brokerage accounts:

### Features
- Connect multiple brokerage accounts
- View account balances and positions
- Secure OAuth-based authentication
- Support for major brokers (Webull, Coinbase, etc.)
- Automatic connection status tracking

### Supported Brokers
- Alpaca
- Coinbase
- E*Trade
- Fidelity
- Interactive Brokers
- Kraken
- Robinhood
- Charles Schwab
- TradeStation
- Tradier
- Trading212
- Vanguard
- Webull

### Implementation Details

#### User Registration Flow
1. User initiates SnapTrade registration
2. System creates SnapTrade user account
3. User credentials (userId and userSecret) stored securely
4. Redirect to broker connection interface

#### Broker Connection Process
1. User selects broker to connect
2. System generates secure connection URL via SnapTrade
3. User authenticates with broker
4. System stores connection details and authorization ID
5. Real-time connection status updates

#### Data Model
```typescript
interface SnapTradeUser {
  userId: string
  userSecret: string
  registeredAt: Date
  brokerConnections: Array<{
    accountId: string
    authorizationId: string
    brokerName: string
    accountName: string
    status: string
  }>
}
```

#### API Endpoints
- `/api/snaptrade/register` - Register new SnapTrade user
- `/api/snaptrade/connect` - Connect broker account
- `/api/snaptrade/disconnect` - Disconnect broker account
- `/api/snaptrade/connections` - List connected brokers

### Environment Setup
Add SnapTrade configuration to your `.env.local`:
```env
SNAPTRADE_CLIENT_ID=your_client_id
SNAPTRADE_CONSUMER_KEY=your_consumer_key
SNAPTRADE_API_BASE_URL=https://api.snaptrade.com
SNAPTRADE_API_VERSION=v1
```

### Security Considerations
- User secrets never stored in frontend
- Secure OAuth flow for broker connections
- Automatic session management
- Connection status verification
- Secure disconnection process

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Pusher](https://pusher.com/)
- [Redis](https://redis.io/)
