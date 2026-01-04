'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoCardProps {
    title: string
    description: string
    icon: string
    className?: string
    delay?: number
}

function BentoCard({ title, description, icon, className, delay = 0 }: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "group relative overflow-hidden rounded-3xl p-8",
                "bg-white dark:bg-slate-900",
                "border border-slate-200 dark:border-slate-800",
                "shadow-sm hover:shadow-xl transition-all duration-500",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <span className="material-symbols-outlined text-9xl">{icon}</span>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                </div>

                <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export function BentoGrid() {
    return (
        <section className="px-4 py-24 bg-slate-50 dark:bg-slate-950/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                        Everything you need. <br />
                        <span className="text-slate-400 dark:text-slate-500"> nothing you don&apos;t.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Card 1: Multi-Platform (Large) */}
                    <BentoCard
                        title="Multi-Platform Command"
                        description="Control Twitter, LinkedIn, Instagram, and more from a single, unified interface. Stop switching tabs."
                        icon="hub"
                        className="md:col-span-2 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800/50"
                        delay={0.1}
                    />

                    {/* Card 2: Analytics */}
                    <BentoCard
                        title="Deep Analytics"
                        description="Track real-time performance metrics and understand your audience growth."
                        icon="analytics"
                        delay={0.2}
                    />

                    {/* Card 3: Scheduling */}
                    <BentoCard
                        title="Smart Scheduling"
                        description="AI-powered best times to post for maximum engagement."
                        icon="schedule"
                        className="bg-slate-900 text-white dark:bg-primary"
                        delay={0.3}
                    />

                    {/* Card 4: Media Library */}
                    <BentoCard
                        title="Media Library"
                        description="Store, organize, and edit your assets in one secure cloud vault."
                        icon="perm_media"
                        className="md:col-span-2"
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    )
}
