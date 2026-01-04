'use client'

import { PlatformIcon } from './platform-icon'
import { PostStatus } from '@/types'
import Image from 'next/image'

interface CustomEventProps {
  event: {
    title: string;
    start?: Date;
    end?: Date;
    resource: {
      platform: any;
      status: PostStatus;
      media_urls?: string[];
    };
  };
}

export function CustomEvent({ event }: CustomEventProps) {
  const { title, resource } = event
  const { platform, status, media_urls } = resource

  const statusStyles = {
    pending: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  }

  return (
    <div className="flex items-start gap-2 p-1.5 rounded-lg w-full h-full text-left bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700">
      {media_urls && media_urls.length > 0 ? (
        <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
          <Image 
            src={media_urls[0]} 
            alt="media" 
            fill 
            className="object-cover" 
            sizes="40px"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <PlatformIcon platform={platform} size="sm" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{title}</p>
        <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${statusStyles[status]}`}>
          {status}
        </div>
      </div>
    </div>
  )
}
