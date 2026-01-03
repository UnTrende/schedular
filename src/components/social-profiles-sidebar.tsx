'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { SocialConnection } from '@/types'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Search } from 'lucide-react'

export function SocialProfilesSidebar() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4">Social profiles ({connections.length}/30)</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
        </div>
      ) : (
        <div className="flex-1 space-y-2 overflow-y-auto">
            {connections.map(conn => (
                <Card key={conn.id} className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                    <PlatformIcon platform={conn.platform} />
                    <div>
                        <p className="font-semibold text-sm">{conn.platform_username}</p>
                        <p className="text-xs text-slate-500">{conn.platform}</p>
                    </div>
                </Card>
            ))}
        </div>
      )}
    </div>
  )
}
