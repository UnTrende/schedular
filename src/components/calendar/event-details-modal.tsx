'use client'

import { Modal, Button } from '@/components/ui'
import { PlatformIcon } from '@/components/shared/platform-icon'
import { ScheduledPost, PostStatus } from '@/types'
import dayjs from 'dayjs'
import Image from 'next/image'

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: any | null
  onDelete: (id: string) => void
}

export function EventDetailsModal({ isOpen, onClose, event, onDelete }: EventDetailsModalProps) {
  if (!event) return null

  const { title, start, resource } = event
  const { id, platform, status, media_urls } = resource as { 
    id: string, 
    platform: any, 
    status: PostStatus, 
    media_urls: string[] 
  }

  const statusStyles = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Details"
      description={`Scheduled for ${dayjs(start).format('MMMM D, YYYY @ h:mm A')}`}
      size="md"
    >
      <div className="mt-4 space-y-6">
        {/* Status & Platform */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800`}>
              <PlatformIcon platform={platform} size="lg" />
            </div>
            <div>
               <p className="font-semibold capitalize text-slate-900 dark:text-white">{platform}</p>
               <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
                 {status}
               </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
            {title}
          </p>
        </div>

        {/* Media */}
        {media_urls && media_urls.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Attached Media</p>
            <div className="grid grid-cols-2 gap-2">
              {media_urls.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                   {url.match(/\.(mp4|mov)$/i) ? (
                      <video src={url} className="w-full h-full object-cover" controls />
                   ) : (
                      <Image src={url} alt="Post media" fill className="object-cover" />
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
           <Button variant="secondary" onClick={onClose}>Close</Button>
           {status === 'pending' && (
             <Button variant="danger" onClick={() => { onDelete(id); onClose(); }}>
               Delete Post
             </Button>
           )}
        </div>
      </div>
    </Modal>
  )
}
