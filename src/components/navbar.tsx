import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'
import { ClientNavbar } from './client-navbar' // We'll need this for active states

export async function Navbar() {
  const { userId } = await auth()

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 flex flex-col p-4">
      {/* Logo */}
      <div className="p-4">
        <Link href={userId ? '/dashboard' : '/'} className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Scheduler
          </h2>
        </Link>
      </div>

      {/* Main Navigation */}
      {userId ? (
        <>
          <ClientNavbar />
          <div className="flex-grow"></div>
          {/* Bottom Settings */}
          <div className="flex items-center justify-between p-2">
             <UserButton />
             <ThemeToggle />
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Sign In
            </Link>
            <Link href="/sign-up" className="w-full text-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-md">
                Get Started
            </Link>
        </div>
      )}
    </aside>
  )
}
