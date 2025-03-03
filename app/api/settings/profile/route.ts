import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, bio, avatarUrl } = body

    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          firstName,
          lastName,
          bio,
          avatarUrl,
        },
      },
      { new: true }
    )

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 