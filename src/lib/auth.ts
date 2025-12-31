import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Get the current authenticated user's ID
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

/**
 * Get the current authenticated user's full profile
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  return await currentUser()
}

/**
 * Require authentication - throws if not authenticated
 * Use this in Server Actions and API routes where auth is required
 */
export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  return userId
}

/**
 * Get user's email address
 * Returns null if not authenticated or no email
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await currentUser()
  return user?.emailAddresses[0]?.emailAddress ?? null
}

/**
 * Check if user has a specific role
 * Useful for admin features (future enhancement)
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await currentUser()
  return user?.publicMetadata?.role === role
}
