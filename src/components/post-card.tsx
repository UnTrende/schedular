import { Card } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { StatusBadge } from '@/components/status-badge'
import { formatDateTime, formatRelativeTime, truncateText } from '@/lib/utils'
import { ScheduledPost } from '@/types'
import Image from 'next/image'

interface PostCardProps {
  post: ScheduledPost
  onEdit?: (post: ScheduledPost) => void
  onDelete?: (post: ScheduledPost) => void
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const isPast = new Date(post.scheduled_at) < new Date()
  const isPublished = post.status === 'published'
  const isFailed = post.status === 'failed'

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={post.platform} size="md" />
          <StatusBadge status={post.status} type="post" />
        </div>
        
        {!isPublished && !isFailed && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit post"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-xl">
                  edit
                </span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(post)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete post"
              >
                <span className="material-symbols-outlined text-red-500 text-xl">
                  delete
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-slate-900 dark:text-white mb-3 whitespace-pre-wrap">
        {truncateText(post.content, 200)}
      </p>

      {post.media_urls && post.media_urls.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {post.media_urls.slice(0, 4).map((url, index) => {
            const isVideo = url.match(/\.(mp4|mov)$/i)
            return (
              <div
                key={index}
                className="w-20 h-20 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative"
              >
                {isVideo ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>
            )
          })}
          {post.media_urls.length > 4 && (
            <div className="w-20 h-20 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                +{post.media_urls.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-base">
            {isPublished ? 'check_circle' : isPast ? 'schedule' : 'pending'}
          </span>
          <span>
            {isPublished && post.published_at
              ? `Published ${formatRelativeTime(post.published_at)}`
              : `Scheduled for ${formatDateTime(post.scheduled_at)}`}
          </span>
        </div>
        
        {isFailed && post.error_message && (
          <span className="text-red-500 flex items-center gap-1" title={post.error_message}>
            <span className="material-symbols-outlined text-base">error</span>
            Failed
          </span>
        )}
      </div>

      {isFailed && post.error_message && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-400">
            <strong>Error:</strong> {post.error_message}
          </p>
        </div>
      )}
    </Card>
  )
}
