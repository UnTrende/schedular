import 'server-only'
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

// Helper function to lazy-load and validate the encryption key
function getKeyBuffer(): Buffer {
  const KEY = process.env.ENCRYPTION_KEY
  if (!KEY) {
    // This error will now only be thrown at runtime if the key is missing
    throw new Error('ENCRYPTION_KEY is not defined in environment variables at runtime.')
  }
  return Buffer.from(KEY, 'hex')
}

/**
 * Encrypts a token using AES-256-GCM
 * Returns format: iv:authTag:encryptedData
 */
export function encryptToken(text: string): string {
  if (!text) return ''

  const keyBuffer = getKeyBuffer() // Access KEY when function is called
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')

  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypts a token using AES-256-GCM
 * Expects format: iv:authTag:encryptedData
 */
export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return ''

  try {
    const keyBuffer = getKeyBuffer() // Access KEY when function is called
    const parts = encryptedText.split(':')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format')
    }

    const [ivHex, authTagHex, encryptedHex] = parts

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv)

    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return '' // Return empty string on failure rather than throwing
  }
}
