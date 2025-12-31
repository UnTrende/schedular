import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Server Component wrapper for protected routes
 * Redirects to sign-in if not authenticated
 */
export async function ProtectedRoute({ 
  children, 
  redirectTo = '/sign-in' 
}: ProtectedRouteProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect(redirectTo)
  }

  return <>{children}</>
}
