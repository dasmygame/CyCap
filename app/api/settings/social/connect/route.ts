import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Map of supported platforms and their OAuth URLs
const PLATFORM_AUTH_URLS = {
  twitter: 'https://twitter.com/i/oauth2/authorize',
  linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
  tradingview: 'https://www.tradingview.com/oauth/authorize'
}

// Supported social media platforms
type Platform = keyof typeof PLATFORM_AUTH_URLS

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get platform from request body
    const { platform } = await req.json()
    
    // Validate platform
    if (!Object.keys(PLATFORM_AUTH_URLS).includes(platform)) {
      return new NextResponse('Invalid platform', { status: 400 })
    }

    // Generate state parameter for security
    const state = Math.random().toString(36).substring(7)
    
    // Store state in session or database to verify later
    // TODO: Implement state storage

    // Generate OAuth URL for the platform
    const authUrl = new URL(PLATFORM_AUTH_URLS[platform as Platform])
    
    // Add necessary OAuth parameters
    const params = new URLSearchParams({
      client_id: process.env[`${platform.toUpperCase()}_CLIENT_ID`] || '',
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/settings/social/callback/${platform}`,
      state,
      response_type: 'code',
      scope: getPlatformScope(platform as Platform)
    })
    
    authUrl.search = params.toString()

    // Return the authorization URL
    return NextResponse.json({ url: authUrl.toString() })
  } catch (error) {
    console.error('Error initiating social connection:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Get required OAuth scopes for each platform
function getPlatformScope(platform: Platform): string {
  switch (platform) {
    case 'twitter':
      return 'tweet.read users.read'
    case 'linkedin':
      return 'r_liteprofile'
    case 'tradingview':
      return 'read_user'
    default:
      return ''
  }
} 