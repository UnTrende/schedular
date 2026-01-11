import { Platform } from '@/types'
import { PLATFORMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from './social-icons'

interface PlatformIconProps {
  platform: Platform
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  className?: string
}

const icons = {
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
}

export function PlatformIcon({ platform, size = 'md', showName = false, className }: PlatformIconProps) {
  const config = PLATFORMS[platform]
  const Icon = icons[platform]

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className={cn(sizes[size])}
        style={{ color: config.brandColor }}
      >
        <Icon />
      </div>
      {showName && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {config.name}
        </span>
      )}
    </div>
  )
}
