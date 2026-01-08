'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Platform } from '@/types'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/shared/platform-icon'
import { PLATFORMS } from '@/lib/constants'

interface PlatformSelectorProps {
    selectedPlatforms: Platform[]
    onToggle: (platform: Platform) => void
}

export function PlatformSelector({ selectedPlatforms, onToggle }: PlatformSelectorProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3 p-2">
            {Object.entries(PLATFORMS).map(([key, config]) => {
                const platformKey = key as Platform
                const isSelected = selectedPlatforms.includes(platformKey)

                return (
                    <motion.button
                        key={key}
                        type="button"
                        onClick={() => onToggle(platformKey)}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            scale: isSelected ? 1.05 : 1,
                            borderColor: isSelected ? 'var(--color-primary)' : 'transparent'
                        }}
                        className={cn(
                            "relative group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300",
                            isSelected
                                ? "bg-primary/5 border-primary shadow-[0_0_20px_-5px_rgba(44,105,255,0.3)]"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        )}
                    >
                        {/* Selection Check Circle */}
                        <div className={cn(
                            "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 transition-all duration-200",
                            isSelected ? "bg-primary scale-100" : "bg-transparent scale-0"
                        )}>
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>

                        <PlatformIcon platform={platformKey} />
                        <span className={cn(
                            "font-medium transition-colors",
                            isSelected ? "text-primary" : "text-slate-600 dark:text-slate-300"
                        )}>
                            {config.name}
                        </span>

                        {/* Shine Effect on Hover */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </div>
                    </motion.button>
                )
            })}
        </div>
    )
}
