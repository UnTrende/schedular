import { Badge } from '@/components/ui'
import { PostStatus, ConnectionStatus } from '@/types'

interface StatusBadgeProps {
  status: PostStatus | ConnectionStatus
  type: 'post' | 'connection'
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  if (type === 'post') {
    const postStatusConfig = {
      pending: { variant: 'info' as const, label: 'Scheduled' },
      published: { variant: 'success' as const, label: 'Published' },
      failed: { variant: 'danger' as const, label: 'Failed' },
    }
    
    const config = postStatusConfig[status as PostStatus]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Connection status
  const connectionStatusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    reconnect_needed: { variant: 'warning' as const, label: 'Reconnect Needed' },
    inactive: { variant: 'default' as const, label: 'Inactive' },
  }
  
  const config = connectionStatusConfig[status as ConnectionStatus]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
