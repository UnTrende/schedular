'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Textarea, Label, Select } from '@/components/ui'
import { PlatformIcon } from '@/components/platform-icon'
import { MediaUploader } from '@/components/media-uploader'
import { ScheduleTimePicker } from '@/components/schedule-time-picker'
import { PLATFORMS } from '@/lib/constants'
import { Platform } from '@/types'
import { useToast } from '@/components/providers/toast-provider'
import { getRemainingChars } from '@/lib/utils'

export function PostCreationForm() {
  const router = useRouter()
  const toast = useToast()
  
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [scheduledAt, setScheduledAt] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Check if media is required
    if (platformConfig.requiresMedia && mediaUrls.length === 0) {
      toast.error(`${platformConfig.name} requires at least one image or video`)
      return
    }

    setIsSubmitting(true)

    try {
      // Convert local datetime string to UTC ISO string
      // scheduledAt is in format "2026-01-02T14:30" (local timezone)
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
        router.push('/scheduled-posts')
      } else {
        toast.error(data.error || 'Failed to schedule post')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum datetime (5 minutes from now)
  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().slice(0, 16)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <Label htmlFor="platform" required>
              Select Platform
            </Label>
            <Select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              {Object.entries(PLATFORMS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </Select>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Character limit: {platformConfig.maxChars}
            </p>
          </div>

          {/* Post Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content" required>
                Post Content
              </Label>
              <span
                className={`text-sm font-medium ${
                  isOverLimit
                    ? 'text-red-500'
                    : remainingChars < 20
                    ? 'text-yellow-500'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {remainingChars} characters remaining
              </span>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your post for ${platformConfig.name}...`}
              rows={6}
              error={isOverLimit ? `Exceeds ${platformConfig.maxChars} character limit` : undefined}
            />
          </div>

          {/* Schedule Time */}
          <div>
            <Label htmlFor="scheduledAt" required>
              Schedule Time
            </Label>
            <ScheduleTimePicker
              value={scheduledAt}
              onChange={setScheduledAt}
            />
          </div>

          {/* Media Upload */}
          <div>
            <Label>Media (Optional)</Label>
            <MediaUploader
              onUploadComplete={(urls) => setMediaUrls(urls)}
              maxFiles={platformConfig.maxMediaFiles}
              existingUrls={mediaUrls}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || isOverLimit}
        >
          <span className="material-symbols-outlined text-xl">schedule_send</span>
          <span>Schedule Post</span>
        </Button>
      </div>

      {/* Platform Info */}
      <Card className="mt-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-start gap-3">
          <PlatformIcon platform={platform} size="lg" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Posting to {platformConfig.name}
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Max characters: {platformConfig.maxChars}</li>
              <li>• Media support: {platformConfig.supportsMedia ? 'Yes' : 'No'}</li>
              {platformConfig.supportsMedia && (
                <li>• Max media files: {platformConfig.maxMediaFiles}</li>
              )}
              {platformConfig.requiresMedia && (
                <li className="text-yellow-600 dark:text-yellow-400">
                  • Media is required for this platform
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </form>
  )
}
