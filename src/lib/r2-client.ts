import { S3Client } from '@aws-sdk/client-s3'

let s3Client: S3Client | null = null

export function getR2Client() {
  if (s3Client) {
    return s3Client
  }

  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 environment variables')
  }

  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  return s3Client
}

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'social-scheduler'
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || ''
