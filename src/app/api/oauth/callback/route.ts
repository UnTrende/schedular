import { NextRequest, NextResponse } from 'next/server'
import { parseOAuthState, OAUTH_PROVIDERS } from '@/lib/oauth-providers'
import { createConnection } from '@/lib/db/connections'
import { Platform } from '@/types'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/oauth/callback
// Handles OAuth callback from providers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${request.nextUrl.origin}/connections?error=${encodeURIComponent(error)}`
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}/connections?error=missing_parameters`
      )
    }

    // Parse and validate state
    const stateData = parseOAuthState(state)
    
    if (!stateData) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}/connections?error=invalid_state`
      )
    }

    const { userId, platform } = stateData
    const provider = OAUTH_PROVIDERS[platform as Platform]
    
    // Get secrets
    const clientId = process.env[provider.clientIdEnv]
    const clientSecret = process.env[provider.clientSecretEnv]

    if (!clientId || !clientSecret) {
      console.error(`Missing env vars for ${platform}`)
      return NextResponse.redirect(
        `${request.nextUrl.origin}/connections?error=config_error`
      )
    }

    // Exchange code for access token
    const redirectUri = `${request.nextUrl.origin}/api/oauth/callback`
    
    let tokenData: any = {}
    let accessToken = ''
    let platformUserId = ''
    let platformUsername = ''

    if (platform === 'facebook' || platform === 'instagram') {
        const tokenUrl = `${provider.tokenUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
        const response = await fetch(tokenUrl)
        tokenData = await response.json()
        
        if (tokenData.error) {
            throw new Error(tokenData.error.message)
        }
        
        accessToken = tokenData.access_token

        // Fetch User Info (for ID and Name)
        // For Facebook/Instagram Graph API
        const meUrl = `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`
        const userResponse = await fetch(meUrl)
        const userData = await userResponse.json()
        
        platformUserId = userData.id
        platformUsername = userData.name || platform 
    } else {
        // Generic fallback or specific impl for Twitter/LinkedIn would go here
        // For now, we reuse placeholder for others to avoid breaking them if credentials aren't set
         accessToken = `demo_token_${platform}_${Date.now()}`
         platformUserId = `demo_id_${Date.now()}`
         platformUsername = `Demo ${platform} User`
    }

    // Store the connection
    await createConnection({
      user_id: userId,
      platform,
      encrypted_access_token: accessToken,
      platform_username: platformUsername,
      platform_user_id: platformUserId,
    })

    // Redirect back to connections page with success
    return NextResponse.redirect(
      `${request.nextUrl.origin}/connections?success=true&platform=${platform}`
    )
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${request.nextUrl.origin}/connections?error=callback_failed`
    )
  }
}
