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

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (via NextAuth.js)

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

- 📱 **Responsive Design**
  - Mobile-first approach
  - Dark/Light theme support
  - Smooth transitions
  - Modern UI/UX

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm/yarn

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
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
traecer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── components/        # Shared components
│   └── providers/         # Context providers
├── lib/                   # Utility functions
├── public/               # Static assets
└── types/               # TypeScript types
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/dashboard` - Dashboard data
- `/api/communities` - Community management
- `/api/positions` - Trading positions

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
