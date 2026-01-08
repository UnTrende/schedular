'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { SocialProfilesSidebar } from '@/components/layout/social-profiles-sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ListTodo, Waypoints, PlusCircle } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Calendar', icon: LayoutDashboard },
  { href: '/scheduled-posts', label: 'Posts', icon: ListTodo },
  { href: '/connections', label: 'Connections', icon: Waypoints },
  { href: '/create-post', label: 'New Post', icon: PlusCircle, isPrimary: true },
]

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    // Ensure we are on the client before using document.body
    useEffect(() => {
        setMounted(true)
    }, [])

    const MenuContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - High Z-index relative to body */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm md:hidden"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    />

                    {/* Drawer - Highest Z-index */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[9999] md:hidden shadow-2xl flex flex-col"
                        style={{ position: 'fixed', top: 0, bottom: 0, left: 0 }}
                    >
                        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <h2 className="font-heading text-lg font-bold">Menu</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Main Navigation - Mobile Optimized List */}
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</h3>
                                <nav className="flex flex-col gap-2">
                                    {navLinks.map(({ href, label, icon: Icon, isPrimary }) => {
                                        const isActive = pathname.startsWith(href)
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                                                    isPrimary 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                        : isActive 
                                                            ? "bg-primary/10 text-primary font-medium" 
                                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Icon className={cn("w-6 h-6", isPrimary ? "text-white" : isActive ? "text-primary" : "text-slate-500")} />
                                                <span className="text-base">{label}</span>
                                                
                                                {/* Active Indicator Arrow */}
                                                {!isPrimary && isActive && (
                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            {/* Social Profiles */}
                            <div className="h-[400px] relative">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Profiles</h3>
                                <div className="h-full -mx-2">
                                     <SocialProfilesSidebar />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="md:hidden">
                <span className="material-symbols-outlined">menu</span>
            </Button>

            {mounted && createPortal(MenuContent, document.body)}
        </>
    )
}
