'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ListTodo, Waypoints, PlusCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navLinks = [
  { href: '/dashboard', label: 'Calendar', icon: LayoutDashboard },
  { href: '/scheduled-posts', label: 'Posts', icon: ListTodo },
  { href: '/connections', label: 'Connections', icon: Waypoints },
  { href: '/create-post', label: 'New Post', icon: PlusCircle, isPrimary: true },
]

export function ClientNavbar() {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col gap-4 w-full items-center">
        {navLinks.map(({ href, label, icon: Icon, isPrimary }) => {
          const isActive = pathname.startsWith(href)

          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    'relative flex items-center justify-center size-10 rounded-xl transition-all duration-200 group',
                    isPrimary
                      ? 'bg-primary text-white hover:bg-indigo-500 shadow-lg shadow-primary/25'
                      : isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isPrimary && "w-6 h-6")} strokeWidth={isPrimary ? 2 : 2} />

                  {/* Active Indicator Dot (for non-primary) */}
                  {!isPrimary && isActive && (
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l-full" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-semibold" sideOffset={10}>
                {label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}
