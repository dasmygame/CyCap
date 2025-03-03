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

- 👥 **Community**
  - Join trading communities
  - Follow top traders
  - Share insights and strategies
  - Real-time updates

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
│   │   └── chat/        # Chat endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── components/       # Shared components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
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
