import { Client, Receiver } from '@upstash/qstash'

let qstashClient: Client | null = null

export function getQStashClient() {
  if (qstashClient) {
    return qstashClient
  }

  const token = process.env.QSTASH_TOKEN || process.env.UPSTASH_QSTASH_TOKEN || process.env.STASH_TOKEN

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

// Verify QStash webhook signature using Upstash Receiver
export function verifyQStashSignature(
  signature: string,
  body: string
): boolean {
  try {
    if (!signature) return false

    const current = process.env.QSTASH_CURRENT_SIGNING_KEY
    const next = process.env.QSTASH_NEXT_SIGNING_KEY

    if (!current) {
      // Without at least current key, we cannot verify
      return false
    }

    const receiver = new Receiver({
      currentSigningKey: current,
      nextSigningKey: next,
    })

    // Throws on invalid signature
    receiver.verify({ signature, body })
    return true
  } catch (e) {
    return false
  }
}
