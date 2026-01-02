import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getConnectionByPlatformServer } from '@/lib/db/connections'
import { Platform } from '@/types'

// GET /api/connections/pages?platform=facebook
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const platform = request.nextUrl.searchParams.get('platform') as Platform
    if (!platform || (platform !== 'facebook' && platform !== 'instagram')) {
       return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // 1. Get the stored User Token
    const { data: connection } = await getConnectionByPlatformServer(userId, platform)
    
    if (!connection || !connection.encrypted_access_token) {
       return NextResponse.json({ error: 'No connection found. Please connect first.' }, { status: 404 })
    }

    const userToken = connection.encrypted_access_token
    
    // 2. Fetch Pages from Facebook Graph API
    // We need 'accounts' to get pages. For Instagram, we look for connected IG accounts.
    const fields = platform === 'facebook' 
      ? 'id,name,access_token,picture{url}' 
      : 'id,name,picture{url},instagram_business_account{id,username,profile_picture_url}'

    const url = `https://graph.facebook.com/v18.0/me/accounts?fields=${fields}&access_token=${userToken}`
    
    console.log(`Fetching pages for user ${userId} on ${platform}...`)
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
       console.error('Facebook Graph API Error:', data.error)
       return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    console.log(`Facebook returned ${data.data?.length || 0} pages.`)

    // 3. Format the list for the UI
    let pages = []
    
    if (platform === 'facebook') {
       pages = data.data.map((p: any) => ({
         id: p.id,
         name: p.name,
         access_token: p.access_token, // Page Token
         image: p.picture?.data?.url
       }))
    } else {
       // Instagram Logic
       // We iterate through FB pages and find linked IG Business Accounts
       pages = data.data
         .filter((p: any) => p.instagram_business_account)
         .map((p: any) => ({
           id: p.instagram_business_account.id, // The Instagram Account ID
           name: p.instagram_business_account.username || p.name,
           access_token: p.access_token, // Crucial: We use the PAGE token to manage the linked IG account
           image: p.instagram_business_account.profile_picture_url || p.picture?.data?.url,
           fb_page_id: p.id
         }))
    }

    console.log(`Formatted ${pages.length} options for ${platform}.`)
    return NextResponse.json({ success: true, data: pages })

  } catch (error: any) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/connections/pages - Save the selected page
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { platform, pageId, pageToken, pageName } = body

    // Update the connection record with the SPECIFIC Page ID and Page Token
    const { getConnectionByPlatformServer, updateConnection } = await import('@/lib/db/connections')
    
    const { data: connection } = await getConnectionByPlatformServer(userId, platform)
    
    if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 })

    await updateConnection(connection.id, {
        platform_user_id: pageId,
        platform_username: pageName,
        encrypted_access_token: pageToken, // Overwrite User Token with Page Token (Crucial for auto-posting)
        status: 'active'
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
