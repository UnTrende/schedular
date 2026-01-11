'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Platform } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import Image from 'next/image'

interface LivePreviewProps {
    content: string
    mediaUrls: string[]
    platform: Platform
}

export function LivePreview({ content, mediaUrls, platform }: LivePreviewProps) {
    // Mock User Data (In a real app, this would come from the connected account)
    const mockUser = {
        name: "John Doe",
        handle: "@johndoe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=2c69ff&color=fff"
    }

    const renderContent = () => {
        // Basic hashtag/link highlighting logic
        const parts = content.split(/(\s+)/)
        return parts.map((part, i) => {
            if (part.startsWith('#') || part.startsWith('http')) {
                return <span key={i} className="text-primary">{part}</span>
            }
            return part
        })
    }

    return (
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-6 h-full flex flex-col items-center justify-center min-h-[500px]">
            <div className="text-center mb-6">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Live Preview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">See how your post looks on {platform}</p>
            </div>

            {/* Phone Frame */}
            <div className="relative w-[320px] bg-white dark:bg-black rounded-[40px] border-[8px] border-slate-900/10 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Status Bar Mock */}
                <div className="h-6 flex justify-between px-6 items-center text-[10px] font-bold text-slate-900 dark:text-white pt-2">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <span className="material-symbols-outlined text-[10px]">signal_cellular_alt</span>
                        <span className="material-symbols-outlined text-[10px]">wifi</span>
                        <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                </div>

                {/* Dynamic Preview Content based on Platform */}
                <div className="p-4 mt-2">

                    {/* Header / User Info */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image src={mockUser.avatar} alt="Avatar" fill />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{mockUser.name}</span>
                                {platform === 'twitter' && (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1DA1F2]" fill="currentColor">
                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.08s-2.77-1.47-4.16-1.11c-.63-1.35-1.93-2.22-3.41-2.22s-2.78.87-3.41 2.22c-1.39-.36-2.97-.08-4.08.81s-1.47 2.77-1.11 4.16c-1.35.63-2.22 1.93-2.22 3.41s.87 2.78 2.22 3.41c-.36 1.39-.08 2.97.81 4.08s2.77 1.47 4.16 1.11c.63 1.35 1.93 2.22 3.41 2.22s2.78-.87 3.41-2.22c1.39.36 2.97.08 4.08-.81s1.47-2.77 1.11-4.16c1.35-.63 2.22-1.93 2.22-3.41zm-12.25 5l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                                {platform === 'twitter' ? mockUser.handle : 'Just now'}
                                {platform === 'linkedin' && ' • Following'}
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">more_horiz</span>
                    </div>

                    {/* Post Content */}
                    <div className="text-sm text-slate-900 dark:text-white mb-3 whitespace-pre-wrap break-words leading-relaxed">
                        {content || <span className="text-slate-400 italic">Start typing to preview...</span>}
                    </div>

                    {/* Media Grid */}
                    <AnimatePresence>
                        {mediaUrls.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "grid gap-1 rounded-xl overflow-hidden mb-3",
                                    mediaUrls.length === 1 ? "grid-cols-1 aspect-video" : "grid-cols-2 aspect-square"
                                )}
                            >
                                {mediaUrls.map((url, i) => (
                                    <div key={i} className="relative w-full h-full bg-slate-100 dark:bg-slate-800">
                                        {/* In a real app we'd show the actual image, for now a placeholder/icon if generic */}
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-4xl">image</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Interaction Bar Mock */}
                    <div className="flex justify-between text-slate-500 mt-4 px-2">
                        {[
                            'chat_bubble_outline',
                            platform === 'twitter' ? 'repeat' : 'share',
                            platform === 'twitter' ? 'favorite_border' : 'thumb_up',
                            platform === 'twitter' ? 'bar_chart' : 'send'
                        ].map((icon, i) => (
                            <span key={i} className="material-symbols-outlined text-lg">{icon}</span>
                        ))}
                    </div>

                </div>

                {/* Bottom Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/20 dark:bg-white/20 rounded-full" />
            </div>
        </div>
    )
}
