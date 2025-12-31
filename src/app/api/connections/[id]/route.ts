import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deleteConnection } from '@/lib/db/connections'
import { supabase } from '@/lib/supabase/client'

// DELETE /api/connections/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const connectionId = params.id

    // Verify connection belongs to user
    const { data: connection } = await supabase()
      .from('social_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single()

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    const { success, error } = await deleteConnection(connectionId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete connection' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
