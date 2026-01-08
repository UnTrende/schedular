import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'
import { ClientNavbar } from './client-navbar'
import { cn } from '@/lib/utils'

// Since we are in a client component for tooltips/interactive states often, 
// let's make sure the structure is solid. 
// AC-2: Icon only, Visually minimal, Thinnest persistent user element.

export async function Navbar() {
  let userId = null
  try {
    const authData = await auth()
    userId = authData.userId
  } catch (e) {
    console.error("Navbar Auth Error:", e)
  }

  return (
    <aside className="hidden md:flex flex-col items-center py-6 w-[70px] bg-gradient-to-b from-white/90 to-slate-50/90 dark:from-card-dark/90 dark:to-slate-900/90 backdrop-blur-xl border-r border-white/60 dark:border-slate-800 z-50 transition-all duration-300 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="mb-8">
        <Link href={userId ? '/dashboard' : '/'} className="flex items-center justify-center group">
          <div className="size-10 flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation (Icons) */}
      {userId && (
        <>
          <div className="flex-1 w-full flex flex-col items-center gap-4">
            {/* Manually rendering client navbar icons logic here or keeping ClientNavbar wrapper if it handles active states well. 
                     Refactoring ClientNavbar to be vertical icon-only is key.
                 */}
            <ClientNavbar />
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col items-center gap-4 mt-auto">
            <ThemeToggle />
            <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
            <UserButton />
          </div>
        </>
      )}
    </aside>
  )
}
