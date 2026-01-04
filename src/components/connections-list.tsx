'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Button, Modal } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { StatusBadge } from '@/components/status-badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/components/providers/toast-provider'
import { PLATFORMS } from '@/lib/constants'
import { Platform, SocialConnection } from '@/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function ConnectionsList({ initialConnections = [] }: { initialConnections?: SocialConnection[] }) {
  const [connections, setConnections] = useState<SocialConnection[]>(initialConnections)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; connection: SocialConnection | null }>({
    isOpen: false,
    connection: null,
  })
  const toast = useToast()
  const searchParams = useSearchParams()

  const [pageSelectionModal, setPageSelectionModal] = useState<{
    isOpen: boolean
    pages: any[]
    platform: Platform | null
  }>({
    isOpen: false,
    pages: [],
    platform: null,
  })

  // Calculate Progress
  const totalPlatforms = Object.keys(PLATFORMS).length
  const connectedCount = connections.length
  const progressPercent = Math.round((connectedCount / totalPlatforms) * 100)

  useEffect(() => {
    // Handle OAuth callback logic (kept same as before)
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const platform = searchParams.get('platform') as Platform | null
    const action = searchParams.get('action')

    if (success === 'true' && platform) {
      if (action === 'select_page' && (platform === 'facebook' || platform === 'instagram')) {
        fetchPages(platform)
      } else {
        toast.success(`Successfully connected to ${PLATFORMS[platform].name}`)
        fetchConnections()
        window.history.replaceState({}, '', '/connections')
      }
    } else if (error) {
      toast.error(`Failed to connect: ${error}`)
      window.history.replaceState({}, '', '/connections')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Keep existing fetch/handler logic...
  const fetchPages = async (platform: Platform) => {
    try {
      const response = await fetch(`/api/connections/pages?platform=${platform}`)
      const data = await response.json()
      if (data.success && data.data && data.data.length > 0) {
        setPageSelectionModal({ isOpen: true, pages: data.data, platform: platform })
      } else if (data.success && data.data.length === 0) {
        toast.error(`No ${platform === 'facebook' ? 'Pages' : 'Business Accounts'} found.`)
      } else {
        toast.error(data.error || 'Failed to fetch pages')
      }
    } catch (error) {
      toast.error('Error fetching pages')
    }
  }

  const handleSelectPage = async (page: any) => {
    if (!pageSelectionModal.platform) return
    try {
      const response = await fetch('/api/connections/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: pageSelectionModal.platform,
          pageId: page.id || page.page_id,
          pageToken: page.access_token,
          pageName: page.name
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Connected to ${page.name}`)
        setPageSelectionModal({ isOpen: false, pages: [], platform: null })
        fetchConnections()
        window.history.replaceState({}, '', '/connections')
      } else {
        toast.error(data.error || 'Failed to select page')
      }
    } catch (error) {
      toast.error('Error selecting page')
    }
  }

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/connections')
      const data = await response.json()
      if (data.success) setConnections(data.data || [])
      else toast.error('Failed to load connections')
    } catch (error) {
      toast.error('Error loading connections')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = (platform: Platform) => {
    window.location.href = `/api/oauth/${platform}`
  }

  const handleDelete = async () => {
    if (!deleteModal.connection) return
    try {
      const response = await fetch(`/api/connections/${deleteModal.connection.id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Connection removed')
        setConnections(connections.filter((c) => c.id !== deleteModal.connection!.id))
        setDeleteModal({ isOpen: false, connection: null })
      } else {
        toast.error('Failed to remove connection')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const platforms = Object.keys(PLATFORMS) as Platform[]

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  }

  return (
    <div className="space-y-8">
      {/* Progress Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Social Ecosystem</h2>
              <p className="text-indigo-100">Connect platforms to expand your reach</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black">{connectedCount}</span>
              <span className="text-xl text-indigo-200">/{totalPlatforms}</span>
            </div>
          </div>
          
          <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        <AnimatePresence>
          {platforms.map((platform, index) => {
            const config = PLATFORMS[platform]
            const connection = connections.find((c) => c.platform === platform)
            const isConnected = !!connection
            
            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div 
                  className={cn(
                    "group relative h-full rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                    isConnected 
                      ? "bg-white dark:bg-slate-900 border-primary/20 shadow-lg shadow-primary/5" 
                      : "bg-slate-50 dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  {/* Status Indicator Line */}
                  {isConnected && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-500" />
                  )}

                  <div className="p-6 md:p-8 flex items-start gap-6">
                    {/* Icon */}
                    <div className={cn(
                      "p-4 rounded-2xl transition-all duration-300",
                      isConnected 
                        ? `bg-${config.color}-100 dark:bg-${config.color}-900/20 text-${config.color}-600 dark:text-${config.color}-400`
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-inner"
                    )}>
                      <PlatformIcon platform={platform} size="xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={cn(
                            "text-xl font-bold mb-1 transition-colors",
                            isConnected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                          )}>
                            {config.name}
                          </h3>
                          
                          {isConnected ? (
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                              </span>
                              Active
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400">Not connected</p>
                          )}
                        </div>
                      </div>

                      {isConnected ? (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-slate-400 text-lg">alternate_email</span>
                             {connection.platform_username}
                          </p>
                          <div className="flex gap-2">
                            {connection.status === 'reconnect_needed' && (
                              <Button variant="primary" size="sm" onClick={() => handleConnect(platform)} className="flex-1">
                                Reconnect
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ isOpen: true, connection })} className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6">
                          <Button 
                            variant="secondary" 
                            className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                            onClick={() => handleConnect(platform)}
                          >
                            Connect {config.name}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Info Card - Redesigned */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex gap-4 items-center text-sm text-blue-800 dark:text-blue-300">
        <span className="material-symbols-outlined text-2xl">info</span>
        <p>
          Need help? Check out the <code className="bg-white/50 px-1.5 py-0.5 rounded font-mono text-blue-600">oauth-setup/SETUP_GUIDE.md</code> to get your developer keys.
        </p>
      </div>

      {/* Modals remain the same */}
      <Modal
        isOpen={pageSelectionModal.isOpen}
        onClose={() => setPageSelectionModal({ isOpen: false, pages: [], platform: null })}
        title={`Select ${pageSelectionModal.platform === 'facebook' ? 'Facebook Page' : 'Instagram Account'}`}
        description="Choose the account you want to post to."
        size="md"
      >
        <div className="mt-4 grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {pageSelectionModal.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSelectPage(page)}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              {page.image ? (
                <div className="w-12 h-12 relative flex-shrink-0">
                  <Image src={page.image} alt={page.name} fill className="rounded-full object-cover border border-slate-100 dark:border-slate-600" sizes="48px" />
                </div>
              ) : (
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">flag</span>
                 </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{page.name}</h4>
                <p className="text-xs text-slate-500">ID: {page.id}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, connection: null })}
        title="Remove Connection"
        description={`Disconnecting will stop scheduled posts for this platform.`}
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, connection: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Disconnect</Button>
        </div>
      </Modal>
    </div>
  )
}
