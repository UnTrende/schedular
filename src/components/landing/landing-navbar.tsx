'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function LandingNavbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        >
            {/* Glass Backdrop */}
            <div className="absolute inset-0 bg-white/0 backdrop-blur-sm -z-10" />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="size-10 flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">calendar_month</span>
                </div>
                <span className="text-xl font-bold font-heading tracking-tight text-slate-900 dark:text-white">
                    Scheduler
                </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hidden md:block">
                    Sign In
                </Link>
                <Link href="/sign-up">
                    <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                        Get Started
                    </Button>
                </Link>
            </div>
        </motion.nav>
    )
}
