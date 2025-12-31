import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getR2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from '@/lib/r2-client'
import { v4 as uuidv4 } from 'uuid'

// POST /api/upload/presigned-url
// Generate presigned URL for direct upload to R2
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
    const { filename, contentType } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing filename or contentType' },
        { status: 400 }
      )
    }

    // Validate content type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
    ]

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Generate unique key
    const fileExtension = filename.split('.').pop()
    const key = `uploads/${userId}/${uuidv4()}.${fileExtension}`

    // Generate presigned URL
    const client = getR2Client()
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600, // 1 hour
    })

    // Construct public URL
    const publicUrl = R2_PUBLIC_DOMAIN
      ? `${R2_PUBLIC_DOMAIN}/${key}`
      : `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${key}`

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        publicUrl,
        key,
      },
    })
  } catch (error: any) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
