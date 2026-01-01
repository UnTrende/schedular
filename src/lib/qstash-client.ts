import { Client } from '@upstash/qstash'

let qstashClient: Client | null = null

export function getQStashClient() {
  if (qstashClient) {
    return qstashClient
  }

  const token = process.env.QSTASH_TOKEN || process.env.STASH_TOKEN

  if (!token) {
    throw new Error('Missing QSTASH_TOKEN environment variable. Please add it to your environment settings.')
  }

  qstashClient = new Client({ token })
  return qstashClient
}

export const QSTASH_SIGNING_KEYS = {
  current: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  next: process.env.QSTASH_NEXT_SIGNING_KEY || '',
}

// Verify QStash webhook signature
export function verifyQStashSignature(
  signature: string,
  body: string
): boolean {
  // In production, implement proper signature verification
  // For now, we'll do basic validation
  
  if (!signature) {
    return false
  }

  // TODO: Implement proper HMAC signature verification
  // using QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY
  
  return true // Placeholder for demo
}
