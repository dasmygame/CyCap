import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

// Platform-specific API endpoints
const PLATFORM_TOKEN_URLS = {
  twitter: 'https://api.twitter.com/2/oauth2/token',
  linkedin: 'https://www.linkedin.com/oauth/v2/accessToken',
  tradingview: 'https://www.tradingview.com/oauth/access_token'
}

// Platform-specific user info endpoints
const PLATFORM_USER_URLS = {
  twitter: 'https://api.twitter.com/2/users/me',
  linkedin: 'https://api.linkedin.com/v2/me',
  tradingview: 'https://www.tradingview.com/api/v1/user/profile'
}

export async function GET(
  req: Request,
  { params }: { params: { platform: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { platform } = params
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    // Validate platform
    if (!Object.keys(PLATFORM_TOKEN_URLS).includes(platform)) {
      return new NextResponse('Invalid platform', { status: 400 })
    }

    // Validate code and state
    if (!code || !state) {
      return new NextResponse('Invalid callback parameters', { status: 400 })
    }

    // TODO: Verify state matches stored state

    // Exchange code for access token
    const tokenResponse = await fetch(PLATFORM_TOKEN_URLS[platform], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env[`${platform.toUpperCase()}_CLIENT_ID`]}:${
            process.env[`${platform.toUpperCase()}_CLIENT_SECRET`]
          }`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/settings/social/callback/${platform}`
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const { access_token } = await tokenResponse.json()

    // Get user info from platform
    const userResponse = await fetch(PLATFORM_USER_URLS[platform], {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userInfo = await userResponse.json()

    // Connect to database
    await connectDB()

    // Update user's social media info
    const now = new Date()
    const update = {
      [`social.${platform}`]: {
        username: getPlatformUsername(platform, userInfo),
        profileUrl: getPlatformProfileUrl(platform, userInfo),
        verified: true,
        connectedAt: now,
        lastVerified: now
      }
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update }
    )

    // Redirect to settings page with success message
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/settings?success=true&platform=' + platform
      }
    })
  } catch (error) {
    console.error('Error handling social callback:', error)
    // Redirect to settings page with error message
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/settings?error=true&platform=' + params.platform
      }
    })
  }
}

// Helper functions to extract platform-specific user info
function getPlatformUsername(platform: string, userInfo: any): string {
  switch (platform) {
    case 'twitter':
      return userInfo.data.username
    case 'linkedin':
      return `${userInfo.localizedFirstName} ${userInfo.localizedLastName}`
    case 'tradingview':
      return userInfo.username
    default:
      return ''
  }
}

function getPlatformProfileUrl(platform: string, userInfo: any): string {
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/${userInfo.data.username}`
    case 'linkedin':
      return `https://www.linkedin.com/in/${userInfo.id}`
    case 'tradingview':
      return `https://www.tradingview.com/u/${userInfo.username}`
    default:
      return ''
  }
} 