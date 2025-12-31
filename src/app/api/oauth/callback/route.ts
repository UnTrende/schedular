import { NextRequest, NextResponse } from 'next/server'
import { parseOAuthState } from '@/lib/oauth-providers'
import { createConnection } from '@/lib/db/connections'

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

    // TODO: Exchange code for access token
    // This is where you'd call the OAuth provider's token endpoint
    // For now, we'll create a placeholder connection
    
    // IMPORTANT: In production, you need to:
    // 1. Exchange the code for an access token
    // 2. Encrypt the token before storing
    // 3. Get user info from the platform
    // 4. Store the encrypted token in the database

    // Placeholder for demo purposes
    const placeholderToken = `demo_token_${platform}_${Date.now()}`
    
    await createConnection({
      user_id: userId,
      platform,
      encrypted_access_token: placeholderToken,
      platform_username: `demo_user_${platform}`,
      platform_user_id: `demo_id_${Date.now()}`,
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
