import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserConnections, createConnection } from '@/lib/db/connections'
import { Platform } from '@/types'

// GET /api/connections - Get all connections for current user
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await getUserConnections(userId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/connections - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { platform, encrypted_access_token, platform_username, platform_user_id } = body

    // Validate required fields
    if (!platform || !encrypted_access_token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate platform
    const validPlatforms: Platform[] = ['twitter', 'facebook', 'instagram', 'linkedin']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    const { data, error } = await createConnection({
      user_id: userId,
      platform,
      encrypted_access_token,
      platform_username,
      platform_user_id,
    })

    if (error) {
      // Check for unique constraint violation (duplicate connection)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Connection already exists for this platform' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create connection' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
