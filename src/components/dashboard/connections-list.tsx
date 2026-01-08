'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Button, Modal } from '@/components/ui'
import { PlatformIcon } from '@/components/shared/platform-icon'
import { StatusBadge } from '@/components/shared/status-badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
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

  const totalPlatforms = Object.keys(PLATFORMS).length
  const connectedCount = connections.length
  const progressPercent = Math.round((connectedCount / totalPlatforms) * 100)

  useEffect(() => {
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
  }, [searchParams])

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
    <div className="space-y-12">
      {/* 🚀 Dynamic Progress Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl shadow-teal-500/10"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-rose-500/10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-teal-400 border border-teal-500/20">
              Account Sync Status
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Build your <span className="text-teal-400">Social</span><br />Command Center
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-white/5 stroke-[8]" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  className="fill-none stroke-teal-400 stroke-[8]" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progressPercent) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">
                {progressPercent}%
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Connected</p>
              <p className="text-4xl font-black">{connectedCount}<span className="text-slate-600 text-xl ml-1">/{totalPlatforms}</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🧩 Professional Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className="group"
              >
                <div 
                  className={cn(
                    "relative h-full overflow-hidden rounded-[2rem] border-2 transition-all duration-500 p-8",
                    isConnected 
                      ? "bg-white dark:bg-slate-900 border-teal-500/20 shadow-xl shadow-teal-500/5" 
                      : "bg-white/50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 hover:border-teal-500/30"
                  )}
                >
                  {/* Subtle Background Platform Pattern */}
                  <div className="absolute -right-4 -top-4 opacity-[0.03] grayscale transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-[0.07]">
                     <PlatformIcon platform={platform} size="xl" className="scale-[5]" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-all duration-500 group-hover:scale-110",
                        isConnected 
                          ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-300"
                      )}>
                        <PlatformIcon platform={platform} size="lg" />
                      </div>

                      {isConnected ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                             <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                             Connected
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className={cn(
                        "text-2xl font-black tracking-tight transition-colors mb-2",
                        isConnected ? "text-slate-900 dark:text-white" : "text-slate-400"
                      )}>
                        {config.name}
                      </h3>
                      
                      {isConnected ? (
                        <div className="space-y-6 mt-6">
                          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
                            <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                               <span className="material-symbols-outlined text-teal-500 text-lg">alternate_email</span>
                            </div>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                              {connection.platform_username || 'Authorized User'}
                            </span>
                          </div>
                          
                          <div className="flex gap-3">
                            {connection.status === 'reconnect_needed' && (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleConnect(platform)} 
                                className="flex-1 rounded-xl font-black bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                              >
                                Reconnect
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteModal({ isOpen: true, connection })} 
                              className="flex-1 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                            >
                              Disconnect Account
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8">
                          <Button 
                            onClick={() => handleConnect(platform)}
                            className="w-full rounded-2xl py-6 font-black tracking-tight transition-all duration-300 bg-slate-900 dark:bg-slate-800 hover:bg-teal-500 hover:shadow-2xl hover:shadow-teal-500/20"
                          >
                            Add {config.name}
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

      {/* 🛡️ Trust Indicator */}
      <div className="flex items-center justify-center gap-8 py-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
         <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Secure AES-256 Encryption</p>
         <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
         <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Direct Official OAuth 2.0</p>
      </div>

      {/* Modals with Clean Glass Styling */}
      <Modal
        isOpen={pageSelectionModal.isOpen}
        onClose={() => setPageSelectionModal({ isOpen: false, pages: [], platform: null })}
        title={`Authorize ${pageSelectionModal.platform === 'facebook' ? 'Page' : 'Account'}`}
        description="Select the verified entity you want to manage through this command center."
        size="md"
      >
        <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {pageSelectionModal.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSelectPage(page)}
              className="flex items-center gap-5 w-full p-5 rounded-3xl border-2 border-slate-50 dark:border-slate-800/50 hover:border-teal-500/30 hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-all duration-300 text-left group"
            >
              <div className="relative h-14 w-14 flex-shrink-0">
                {page.image ? (
                  <Image src={page.image} alt={page.name} fill className="rounded-2xl object-cover shadow-md" sizes="56px" />
                ) : (
                  <div className="h-full w-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">corporate_fare</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
                   <span className="material-symbols-outlined text-white text-[10px]">check</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">{page.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Provider ID: {page.id}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, connection: null })}
        title="Revoke Authorization"
        description="This will immediately stop all scheduled activities for this account. Your encrypted credentials will be purged from our vault."
        size="sm"
      >
        <div className="flex gap-4 justify-end mt-8">
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, connection: null })} className="rounded-xl px-8">Keep Access</Button>
          <Button variant="danger" onClick={handleDelete} className="rounded-xl px-8 bg-rose-500 hover:bg-rose-600 shadow-rose-500/20">Revoke Now</Button>
        </div>
      </Modal>
    </div>
  )
}