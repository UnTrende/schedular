'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, Button, Modal } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { StatusBadge } from '@/components/status-badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/components/providers/toast-provider'
import { PLATFORMS } from '@/lib/constants'
import { Platform, SocialConnection } from '@/types'

export function ConnectionsList() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    fetchConnections()

    // Handle OAuth callback
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const platform = searchParams.get('platform') as Platform | null
    const action = searchParams.get('action')

    if (success === 'true' && platform) {
      if (action === 'select_page' && (platform === 'facebook' || platform === 'instagram')) {
        // Fetch pages/accounts for selection
        fetchPages(platform)
      } else {
        toast.success(`Successfully connected to ${PLATFORMS[platform].name}`)
        window.history.replaceState({}, '', '/connections')
      }
    } else if (error) {
      toast.error(`Failed to connect: ${error}`)
      window.history.replaceState({}, '', '/connections')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchPages = async (platform: Platform) => {
    try {
      const response = await fetch(`/api/connections/pages?platform=${platform}`)
      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        setPageSelectionModal({
          isOpen: true,
          pages: data.data,
          platform: platform
        })
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
          pageId: page.id || page.page_id, // FB uses id, IG uses page_id for mapping sometimes, check API response structure
          pageToken: page.access_token,
          pageName: page.name
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Connected to ${page.name}`)
        setPageSelectionModal({ isOpen: false, pages: [], platform: null })
        fetchConnections() // Refresh list
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

      if (data.success) {
        setConnections(data.data || [])
      } else {
        toast.error('Failed to load connections')
      }
    } catch (error) {
      toast.error('An error occurred while loading connections')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (platform: Platform) => {
    // Redirect to OAuth flow
    window.location.href = `/api/oauth/${platform}`
  }

  const handleDelete = async () => {
    if (!deleteModal.connection) return

    try {
      const response = await fetch(`/api/connections/${deleteModal.connection.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Connection removed successfully')
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
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {platforms.map((platform) => {
          const config = PLATFORMS[platform]
          const connection = connections.find((c) => c.platform === platform)

          return (
            <Card key={platform}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 bg-${config.color}-100 dark:bg-${config.color}-900/20 rounded-xl flex-shrink-0`}>
                    <PlatformIcon platform={platform} size="lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {config.name}
                    </h3>
                    
                    {connection ? (
                      <>
                        <div className="mb-2">
                          <StatusBadge status={connection.status} type="connection" />
                        </div>
                        {connection.platform_username && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            @{connection.platform_username}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {connection.status === 'reconnect_needed' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleConnect(platform)}
                            >
                              <span className="material-symbols-outlined text-base">refresh</span>
                              <span>Reconnect</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModal({ isOpen: true, connection })}
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                            <span>Remove</span>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                          Not connected
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConnect(platform)}
                        >
                          <span className="material-symbols-outlined text-base">link</span>
                          <span>Connect</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
            info
          </span>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              OAuth Setup Required
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
              To connect social media accounts, you need to set up OAuth credentials for each platform.
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              See <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">oauth-setup/SETUP_GUIDE.md</code> for instructions.
            </p>
          </div>
        </div>
      </Card>

      {/* Page Selection Modal */}
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
                <img 
                  src={page.image} 
                  alt={page.name} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-600" 
                />
              ) : (
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">flag</span>
                 </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {page.name}
                </h4>
                <p className="text-xs text-slate-500">ID: {page.id}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, connection: null })}
        title="Remove Connection"
        description={`Are you sure you want to remove ${deleteModal.connection?.platform_username || 'this connection'}? You'll need to reconnect to post to this platform.`}
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, connection: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <span className="material-symbols-outlined text-xl">delete</span>
            <span>Remove</span>
          </Button>
        </div>
      </Modal>
    </>
  )
}
