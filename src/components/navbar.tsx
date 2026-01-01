import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'

export async function Navbar() {
  const { userId } = await auth()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap bg-white dark:bg-card-dark px-6 py-4 shadow-sm bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md">
      <Link href={userId ? '/dashboard' : '/'} className="flex items-center gap-3 group">
        <div className="size-10 flex items-center justify-center bg-primary rounded-xl text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-2xl">calendar_month</span>
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Social Scheduler
        </h2>
      </Link>

      {userId ? (
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Link 
              href="/dashboard" 
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-all hover:bg-white dark:hover:bg-slate-700 shadow-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/scheduled-posts" 
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all"
            >
              Posts
            </Link>
            <Link 
              href="/connections" 
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all"
            >
              Connections
            </Link>
          </nav>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
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
