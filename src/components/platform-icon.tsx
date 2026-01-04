import { Platform } from '@/types'
import { PLATFORMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PlatformIconProps {
  platform: Platform
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  className?: string
}

export function PlatformIcon({ platform, size = 'md', showName = false, className }: PlatformIconProps) {
  const config = PLATFORMS[platform]
  
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  const colorClasses = {
    sky: 'text-sky-500',
    blue: 'text-blue-500',
    pink: 'text-pink-500',
    indigo: 'text-indigo-500',
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('material-symbols-outlined', sizes[size], colorClasses[config.color])}>
        {config.icon}
      </span>
      {showName && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {config.name}
        </span>
      )}
    </div>
  )
}
