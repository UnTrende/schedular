'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { PlatformIcon } from '@/components/shared/platform-icon'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/lib/utils'

export function SocialProfilesSidebar() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/connections')
      const data = await response.json()
      if (data.success) {
        setConnections(data.data || [])
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  // AC-3: Progressive Disclosure, Expand/Collapse animation
  // AC-3.1: No Fixed Width (handled by animate width)

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full bg-white/50 dark:bg-card-dark/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 shadow-md transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header area - Collapsible */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold truncate"
                >
                  Profiles ({connections.length})
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-all", isCollapsed ? "left-1/2 -translate-x-1/2" : "left-3")} />
            {!isCollapsed && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              />
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {connections.map(conn => (
                <div
                  key={conn.id}
                  className={cn(
                    "group flex items-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all gap-3",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <div className="flex-shrink-0">
                    <PlatformIcon platform={conn.platform} className="w-8 h-8" />
                  </div>

                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="min-w-0 flex-1"
                    >
                      <p className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">{conn.platform_username}</p>
                      <p className="text-xs text-slate-500 truncate capitalize">{conn.platform}</p>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Add New Button Placeholder if not collapsed or just icon if collapsed */}
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" size="sm" className={cn("w-full gap-2", isCollapsed && "px-0 aspect-square")}>
                  <span className="material-symbols-outlined text-sm">add</span>
                  {!isCollapsed && <span>Add Profile</span>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
