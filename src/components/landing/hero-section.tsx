'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'

export function HeroSection() {
    return (
        <section className="relative px-4 pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="max-w-5xl mx-auto text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        v2.0 is now live
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                    Master Your <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-indigo-600">
                        Social Presence
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    The all-in-one command center for scheduling, analyzing, and growing your audience across every platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                >
                    <Link href="/sign-in">
                        <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link href="/docs">
                        <Button variant="ghost" size="lg" className="h-12 px-8 text-lg rounded-full">
                            View Documentation
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
