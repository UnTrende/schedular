import { Platform } from '@/types'

// OAuth configuration for each platform
export const OAUTH_PROVIDERS = {
  twitter: {
    name: 'Twitter / X',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    clientIdEnv: 'TWITTER_CLIENT_ID',
    clientSecretEnv: 'TWITTER_CLIENT_SECRET',
  },
  facebook: {
    name: 'Facebook',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: [
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'business_management'
    ],
    clientIdEnv: 'FACEBOOK_APP_ID',
    clientSecretEnv: 'FACEBOOK_APP_SECRET',
  },
  instagram: {
    name: 'Instagram',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: [
      'public_profile',
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement',
      'business_management'
    ],
    clientIdEnv: 'FACEBOOK_APP_ID', // Instagram uses Facebook OAuth
    clientSecretEnv: 'FACEBOOK_APP_SECRET',
  },
  linkedin: {
    name: 'LinkedIn',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['w_member_social', 'r_liteprofile'],
    clientIdEnv: 'LINKEDIN_CLIENT_ID',
    clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
  },
} as const

export function getOAuthUrl(platform: Platform, redirectUri: string, state: string): string {
  const provider = OAUTH_PROVIDERS[platform]
  
  // Get client ID from environment
  const clientId = process.env[provider.clientIdEnv]
  
  if (!clientId) {
    throw new Error(`Missing OAuth client ID for ${platform}`)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: provider.scopes.join(' '),
    state,
  })

  return `${provider.authUrl}?${params.toString()}`
}

export function generateOAuthState(userId: string, platform: Platform): string {
  // Create a state parameter for OAuth security
  const data = {
    userId,
    platform,
    timestamp: Date.now(),
  }
  
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export function parseOAuthState(state: string): { userId: string; platform: Platform; timestamp: number } | null {
  try {
    const decoded = Buffer.from(state, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}
