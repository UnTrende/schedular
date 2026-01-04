'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { useToast } from '@/components/providers/toast-provider'
import { FILE_UPLOAD } from '@/lib/constants'
import { formatFileSize } from '@/lib/utils'
import Image from 'next/image'

interface MediaUploaderProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  existingUrls?: string[]
}

export function MediaUploader({ onUploadComplete, maxFiles = 4, existingUrls = [] }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const toast = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (!files.length) return

    // Check max files
    if (uploadedUrls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate files
    for (const file of files) {
      if (file.size > FILE_UPLOAD.maxSize) {
        toast.error(`File ${file.name} is too large. Max size: ${formatFileSize(FILE_UPLOAD.maxSize)}`)
        return
      }

      if (!FILE_UPLOAD.acceptedTypes.includes(file.type as any)) {
        toast.error(`File type ${file.type} is not supported`)
        return
      }
    }

    setUploading(true)

    try {
      const newUrls: string[] = []

      for (const file of files) {
        const fileId = Math.random().toString(36).substring(7)
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        try {
          // Get presigned URL
          const presignedResponse = await fetch('/api/upload/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
            }),
          })

          if (!presignedResponse.ok) {
            throw new Error('Failed to get upload URL')
          }

          const { data } = await presignedResponse.json()
          const { presignedUrl, publicUrl } = data

          // Upload file to R2
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file')
          }

          newUrls.push(publicUrl)
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      const allUrls = [...uploadedUrls, ...newUrls]
      setUploadedUrls(allUrls)
      onUploadComplete(allUrls)
      toast.success(`Uploaded ${newUrls.length} file(s)`)
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const handleRemove = (url: string) => {
    const newUrls = uploadedUrls.filter(u => u !== url)
    setUploadedUrls(newUrls)
    onUploadComplete(newUrls)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {uploadedUrls.length < maxFiles && (
        <div>
          <input
            type="file"
            id="media-upload"
            className="hidden"
            accept={FILE_UPLOAD.acceptedTypes.join(',')}
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="media-upload">
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('media-upload')?.click()
              }}
            >
              <span className="material-symbols-outlined text-xl">
                {uploading ? 'progress_activity' : 'add_photo_alternate'}
              </span>
              <span>{uploading ? 'Uploading...' : 'Add Media'}</span>
            </Button>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Max {maxFiles} files • {formatFileSize(FILE_UPLOAD.maxSize)} each • JPG, PNG, GIF, WebP, MP4
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                {url.match(/\.(mp4|mov)$/i) ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
