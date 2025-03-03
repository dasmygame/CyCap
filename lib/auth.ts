import { NextAuthOptions, DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { connectDB } from './db'
import { User } from './models/User'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      username: string
      avatarUrl?: string
    } & DefaultSession["user"]
  }
}

interface ExtendedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

interface ExtendedToken extends JWT {
  id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatarUrl: user.avatarUrl,
        } as ExtendedUser
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser
        token.id = extendedUser.id
        token.firstName = extendedUser.firstName
        token.lastName = extendedUser.lastName
        token.username = extendedUser.username
        token.avatarUrl = extendedUser.avatarUrl
      }
      return token as ExtendedToken
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedToken
      if (token) {
        session.user = {
          ...session.user,
          id: extendedToken.id,
          firstName: extendedToken.firstName,
          lastName: extendedToken.lastName,
          username: extendedToken.username,
          avatarUrl: extendedToken.avatarUrl,
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} 