'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ListTodo, Waypoints, PlusCircle } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Calendar', icon: LayoutDashboard },
  { href: '/scheduled-posts', label: 'Posts', icon: ListTodo },
  { href: '/connections', label: 'Connections', icon: Waypoints },
  { href: '/create-post', label: 'New Post', icon: PlusCircle, isPrimary: true },
]

export function ClientNavbar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 px-2 py-4">
      {navLinks.map(({ href, label, icon: Icon, isPrimary }) => {
        const isActive = pathname.startsWith(href)
        
        if (isPrimary) {
          return (
             <Link
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 transition-all shadow-md mt-4"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        }

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-300 transition-all',
              isActive
                ? 'bg-blue-100/60 dark:bg-blue-900/20 text-primary dark:text-blue-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
