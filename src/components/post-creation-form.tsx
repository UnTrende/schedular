'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Textarea, Label, Select } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { MediaUploader } from '@/components/media-uploader'
import { ScheduleTimePicker } from '@/components/schedule-time-picker'
import { PLATFORMS } from '@/lib/constants'
import { Platform } from '@/types'
import { useToast } from '@/components/providers/toast-provider'
import { getRemainingChars } from '@/lib/utils'
import dayjs from 'dayjs'

interface PostCreationFormProps {
  initialDate?: Date | null
  onPostCreated: () => void
  onCancel: () => void
}

export function PostCreationForm({ initialDate, onPostCreated, onCancel }: PostCreationFormProps) {
  const router = useRouter()
  const toast = useToast()
  
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [scheduledAt, setScheduledAt] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialDate) {
      const formattedDate = dayjs(initialDate).format('YYYY-MM-DDTHH:mm')
      setScheduledAt(formattedDate)
    }
  }, [initialDate])

  const platformConfig = PLATFORMS[platform]
  const remainingChars = getRemainingChars(content, platformConfig.maxChars)
  const isOverLimit = remainingChars < 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Post content is required')
      return
    }

    if (!scheduledAt) {
      toast.error('Please select a schedule time')
      return
    }

    if (isOverLimit) {
      toast.error(`Content exceeds ${platformConfig.maxChars} character limit`)
      return
    }

    if (platformConfig.requiresMedia && mediaUrls.length === 0) {
      toast.error(`${platformConfig.name} requires at least one image or video`)
      return
    }

    setIsSubmitting(true)

    try {
      const localDate = new Date(scheduledAt)
      const utcScheduledAt = localDate.toISOString()

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          scheduled_at: utcScheduledAt,
          media_urls: mediaUrls,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Post scheduled successfully!')
        onPostCreated() // Call the callback on success
      } else {
        toast.error(data.error || 'Failed to schedule post')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Platform Selection */}
        <div>
          <Label htmlFor="platform" required>Select Platform</Label>
          <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            {Object.entries(PLATFORMS).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </Select>
        </div>

        {/* Post Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="content" required>Post Content</Label>
            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-slate-500'}`}>
              {remainingChars}
            </span>
          </div>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder={`Write your post...`} rows={6} />
        </div>

        {/* Schedule Time */}
        <div>
          <Label htmlFor="scheduledAt" required>Schedule Time</Label>
          <ScheduleTimePicker value={scheduledAt} onChange={setScheduledAt} />
        </div>

        {/* Media Upload */}
        <div>
          <Label>Media (Optional)</Label>
          <MediaUploader onUploadComplete={(urls) => setMediaUrls(urls)} maxFiles={platformConfig.maxMediaFiles} existingUrls={mediaUrls} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting || isOverLimit}>
          Schedule Post
        </Button>
      </div>
    </form>
  )
}
