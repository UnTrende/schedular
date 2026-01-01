'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'

export function ClientNavbar() {
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-card-dark/80 px-6 py-4 shadow-sm backdrop-blur-md">
      <Link href={isSignedIn ? '/dashboard' : '/'} className="flex items-center gap-3 group">
        <div className="size-10 flex items-center justify-center bg-primary rounded-2xl text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
          <span className="material-symbols-outlined text-2xl">calendar_month</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Social Scheduler
        </h2>
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/scheduled-posts" 
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Posts
            </Link>
            <Link 
              href="/connections" 
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Connections
            </Link>
          </nav>
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
