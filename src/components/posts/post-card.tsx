import { Card } from '@/components/ui'
import { PlatformIcon } from '@/components/shared/platform-icon'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDateTime, formatRelativeTime, truncateText } from '@/lib/utils'
import { ScheduledPost } from '@/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: ScheduledPost
  onEdit?: (post: ScheduledPost) => void
  onDelete?: (post: ScheduledPost) => void
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const isPast = new Date(post.scheduled_at) < new Date()
  const isPublished = post.status === 'published'
  const isFailed = post.status === 'failed'

  const hasMedia = post.media_urls && post.media_urls.length > 0

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
            <PlatformIcon platform={post.platform} size="sm" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {post.platform}
          </span>
        </div>
        <StatusBadge status={post.status} type="post" />
      </div>

      {/* Media Preview (Hero Style) */}
      {hasMedia && (
        <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
             {/* Show first media item as hero */}
             {(() => {
                const firstUrl = post.media_urls![0]
                const isVideo = firstUrl.match(/\.(mp4|mov)$/i)
                return isVideo ? (
                  <video src={firstUrl} className="w-full h-full object-cover" muted />
                ) : (
                   <Image
                    src={firstUrl}
                    alt="Post media"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )
             })()}
             
             {/* Multiple items indicator */}
             {post.media_urls!.length > 1 && (
               <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">photo_library</span>
                 <span>+{post.media_urls!.length - 1}</span>
               </div>
             )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
         {/* Date/Time Meta */}
         <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
             <span className="material-symbols-outlined text-[16px]">
               {isPublished ? 'published_with_changes' : 'event'}
             </span>
             <span>
               {isPublished && post.published_at
                 ? `Published ${formatRelativeTime(post.published_at)}` 
                 : formatDateTime(post.scheduled_at)
               }
             </span>
         </div>

         {/* Text */}
         <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-4 font-normal">
           {post.content}
         </p>

         {/* Error State */}
         {isFailed && post.error_message && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400">
            <div className="flex items-center gap-1 font-semibold mb-1">
               <span className="material-symbols-outlined text-[16px]">error</span>
               <span>Publishing Failed</span>
            </div>
            {post.error_message}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!isPublished && !isFailed && (
        <div className="mt-auto px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Edit"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(post)}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Delete"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            )}
        </div>
      )}
    </div>
  )
}