export const PLATFORMS = {
  twitter: {
    name: 'Twitter / X',
    brandColor: '#1DA1F2',
    maxChars: 280,
    supportsMedia: true,
    maxMediaFiles: 4,
    requiresMedia: false as const,
  },
  facebook: {
    name: 'Facebook',
    brandColor: '#1877F2',
    maxChars: 63206,
    supportsMedia: true,
    maxMediaFiles: 10,
    requiresMedia: false as const,
  },
  instagram: {
    name: 'Instagram',
    brandColor: '#E4405F',
    maxChars: 2200,
    supportsMedia: true,
    maxMediaFiles: 10,
    requiresMedia: true as const,
  },
  linkedin: {
    name: 'LinkedIn',
    brandColor: '#0A66C2',
    maxChars: 3000,
    supportsMedia: true,
    maxMediaFiles: 9,
    requiresMedia: false as const,
  },
} as const

// File Upload Limits
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4'],
} as const

// Scheduling Limits
export const SCHEDULING = {
  minScheduleMinutes: 5, // Minimum 5 minutes from now
  maxScheduleDays: 365, // Maximum 1 year ahead
} as const

// Free Tier Limits (for monitoring)
export const FREE_TIER_LIMITS = {
  supabase: {
    bandwidth: 800 * 1024 * 1024, // 800MB (buffer before 1GB limit)
    storage: 900 * 1024 * 1024, // 900MB (buffer before 1GB limit)
  },
  upstash: {
    messages: 9500, // Buffer before 10k limit
  },
  cloudflare: {
    storage: 9 * 1024 * 1024 * 1024, // 9GB (buffer before 10GB limit)
  },
  fly: {
    monthlyCost: 4.5, // $4.50 (buffer before $5 credit)
  },
} as const

// API Routes
export const API_ROUTES = {
  schedule: '/api/schedule',
  connections: '/api/connections',
  r2Upload: '/api/r2/companion',
  posts: '/api/posts',
} as const
