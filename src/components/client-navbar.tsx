'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'

export function ClientNavbar() {
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark px-6 py-3 shadow-sm backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <Link href={isSignedIn ? '/dashboard' : '/'} className="flex items-center gap-3">
        <div className="size-9 flex items-center justify-center bg-primary rounded-lg text-white shadow-md">
          <span className="material-symbols-outlined text-xl">calendar_month</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Social Scheduler
        </h2>
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/scheduled-posts" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Posts
            </Link>
            <Link 
              href="/connections" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Connections
            </Link>
          </nav>
          <ThemeToggle />
          <UserButton />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-md">
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
