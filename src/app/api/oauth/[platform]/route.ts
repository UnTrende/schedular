import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getOAuthUrl, generateOAuthState } from '@/lib/oauth-providers'
import { Platform } from '@/types'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/oauth/[platform]
// Initiates OAuth flow for a platform
export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const platform = params.platform as Platform
    
    // Validate platform
    const validPlatforms: Platform[] = ['twitter', 'facebook', 'instagram', 'linkedin']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Generate state for CSRF protection
    const state = generateOAuthState(userId, platform)
    
    // Get redirect URI
    const redirectUri = `${request.nextUrl.origin}/api/oauth/callback`
    
    // Generate OAuth URL
    const authUrl = getOAuthUrl(platform, redirectUri, state)

    // Redirect to OAuth provider
    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}
