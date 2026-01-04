'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlatformSelector } from '@/components/platform-selector'
import { LivePreview } from '@/components/live-preview'
import { MediaUploader } from '@/components/media-uploader'
import { ScheduleTimePicker } from '@/components/schedule-time-picker'
import { PLATFORMS } from '@/lib/constants'
import { Platform } from '@/types'
import { useToast } from '@/components/providers/toast-provider'
import { getRemainingChars, cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Textarea } from '@/components/ui/textarea' // We might need to upgrade this one too later
import { Label } from '@/components/ui/label'

interface PostCreationFormProps {
  initialDate?: Date | null
  onPostCreated: () => void
  onCancel: () => void
}

export function PostCreationForm({ initialDate, onPostCreated, onCancel }: PostCreationFormProps) {
  const router = useRouter()
  const toast = useToast()

  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter'])
  const [scheduledAt, setScheduledAt] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewPlatform, setPreviewPlatform] = useState<Platform>('twitter')

  useEffect(() => {
    if (initialDate) {
      const formattedDate = dayjs(initialDate).format('YYYY-MM-DDTHH:mm')
      setScheduledAt(formattedDate)
    }
  }, [initialDate])

  // Update preview platform if the current one is deselected
  useEffect(() => {
    if (!selectedPlatforms.includes(previewPlatform) && selectedPlatforms.length > 0) {
      setPreviewPlatform(selectedPlatforms[0])
    }
  }, [selectedPlatforms, previewPlatform])

  const togglePlatform = (p: Platform) => {
    const isSelected = selectedPlatforms.includes(p)
    if (isSelected) {
      if (selectedPlatforms.length === 1) {
        toast.error("At least one platform is required")
        return
      }
      setSelectedPlatforms(prev => prev.filter(item => item !== p))
    } else {
      setSelectedPlatforms(prev => [...prev, p])
      setPreviewPlatform(p) // Auto-switch preview to newly added platform
    }
  }

  // Calculate constraints based on specific platform currently being previewed or strictest?
  // User likely wants to know if they violate ANY selected platform's rules.
  // For now, let's just validate against the PREVIEW platform for visual feedback, 
  // but validate against ALL on submit.

  const previewConfig = PLATFORMS[previewPlatform]
  const remainingChars = getRemainingChars(content, previewConfig?.maxChars || 280)
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

    // Validate against ALL selected platforms
    for (const p of selectedPlatforms) {
      const config = PLATFORMS[p]
      if (content.length > config.maxChars) {
        toast.error(`Content too long for ${config.name}`)
        return
      }
      if (config.requiresMedia && mediaUrls.length === 0) {
        toast.error(`${config.name} requires media`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const localDate = new Date(scheduledAt)
      const utcScheduledAt = localDate.toISOString()

      // We need to send a request for EACH platform or a batch endpoint.
      // Assuming the API handles one at a time for now, or we loop.
      // Ideally API should handle batch, but let's loop here for simplicity interacting with current API.

      const promises = selectedPlatforms.map(p =>
        fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            platform: p,
            scheduled_at: utcScheduledAt,
            media_urls: mediaUrls,
          }),
        })
      )

      await Promise.all(promises)

      toast.success('Posts scheduled successfully!')
      onPostCreated()

    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* LEFT COLUMN: EDITOR */}
      <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        <form id="post-form" onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Platforms */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Destinations</Label>
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onToggle={togglePlatform}
            />
          </div>

          {/* 2. Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-base font-semibold">Content</Label>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800", isOverLimit ? "text-red-500" : "text-slate-500")}>
                {remainingChars} chars left ({previewConfig?.name})
              </span>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px] text-lg p-4 rounded-2xl resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-primary/20"
            />
          </div>

          {/* 3. Media */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Media</Label>
            <MediaUploader
              onUploadComplete={(urls) => setMediaUrls(urls)}
              maxFiles={4}
              existingUrls={mediaUrls}
            />
          </div>

          {/* 4. Schedule */}
          <div className="space-y-3">
            <Label htmlFor="scheduledAt" className="text-base font-semibold">Schedule for</Label>
            <div className="relative">
              <ScheduleTimePicker value={scheduledAt} onChange={setScheduledAt} />
            </div>
          </div>

        </form>
      </div>

      {/* RIGHT COLUMN: PREVIEW */}
      <div className="hidden lg:block sticky top-0">
        {/* If multiple platforms, show tabs to switch preview */}
        {selectedPlatforms.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {selectedPlatforms.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPreviewPlatform(p)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  previewPlatform === p
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                )}
              >
                {PLATFORMS[p].name}
              </button>
            ))}
          </div>
        )}

        <LivePreview
          content={content}
          mediaUrls={mediaUrls}
          platform={previewPlatform}
        />
      </div>

      {/* Form Actions (Mobile/Desktop shared) */}
      <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button form="post-form" type="submit" variant="primary" isLoading={isSubmitting}>
          Schedule {selectedPlatforms.length > 1 ? `(${selectedPlatforms.length})` : ''}
        </Button>
      </div>
    </div>
  )
}
