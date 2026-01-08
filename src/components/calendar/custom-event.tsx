'use client'

import { PlatformIcon } from '@/components/shared/platform-icon'
import { PostStatus } from '@/types'
import { useCalendarView } from './calendar-context'
import Image from 'next/image'

// Define the shape of our specific event data
export interface MyCalendarEvent {
  title: string;
  start?: Date;
  end?: Date;
  resource: {
    platform: any;
    status: PostStatus;
    media_urls?: string[];
  };
}

export function CustomEvent(props: any) {
  const event = props.event as MyCalendarEvent
  const { title, resource } = event
  const view = useCalendarView()
  
  // Safety check
  if (!resource) return null;

  const { platform, status, media_urls } = resource

  const statusStyles = {
    pending: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  }

  // --- DAY VIEW (True-to-Life Card) ---
  if (view === 'day') {
    return (
      <div className="flex flex-col h-full w-full bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:ring-2 ring-primary/50 transition-all">
        {/* Header: Platform & Status */}
        <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={platform} size="sm" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{platform}</span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${statusStyles[status]}`}>
            {status}
          </span>
        </div>

        {/* Body: Content & Image */}
        <div className="flex-1 p-2 flex gap-2 min-h-0">
          {/* Text Content */}
          <div className="flex-1 min-w-0">
             <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
               {title}
             </p>
          </div>

          {/* Image Preview (Larger in Day View) */}
          {media_urls && media_urls.length > 0 && (
            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              <Image 
                src={media_urls[0]} 
                alt="media" 
                fill 
                className="object-cover" 
                sizes="64px"
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- WEEK/MONTH VIEW (Compact Pill) ---
  return (
    <div className="flex items-center gap-2 p-1 rounded-md w-full h-full text-left bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
      {/* Icon only for compact view */}
      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
         {media_urls && media_urls.length > 0 ? (
             <span className="material-symbols-outlined text-[14px]">image</span>
         ) : (
             <PlatformIcon platform={platform} size="sm" />
         )}
      </div>
      
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            status === 'published' ? 'bg-green-500' : 
            status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
        }`} />
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate leading-none">
            {title}
        </p>
      </div>
    </div>
  )
}
