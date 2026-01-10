'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { useToast } from '@/components/providers/toast-provider'
import { FILE_UPLOAD } from '@/lib/constants'
import { formatFileSize } from '@/lib/utils'
import Image from 'next/image'
import { Platform } from '@/types'
import { ImageCropper } from '@/components/shared/image-cropper'

interface MediaUploaderProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  existingUrls?: string[]
  platform: Platform // NEW: Need platform for ratio constraints
}

export function MediaUploader({ onUploadComplete, maxFiles = 4, existingUrls = [], platform }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const toast = useToast()

  // Cropper State
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([]) // Files waiting in queue

  const getTargetRatio = (p: Platform) => {
    // Return aspect ratio (width / height)
    switch (p) {
      case 'instagram': return 4 / 5; // 0.8
      case 'twitter': return 16 / 9; // 1.91 (approx)
      case 'linkedin': return 1.91;
      case 'facebook': return 1.91;
      default: return 1;
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    // Check max files
    if (uploadedUrls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    const filesToUpload: File[] = []

    for (const file of files) {
      // Size Check
      if (file.size > FILE_UPLOAD.maxSize) {
        toast.error(`File ${file.name} is too large. Max size: ${formatFileSize(FILE_UPLOAD.maxSize)}`)
        continue
      }

      // Type Check
      if (!FILE_UPLOAD.acceptedTypes.includes(file.type as any)) {
        toast.error(`File type ${file.type} is not supported`)
        continue
      }

      // Image Ratio Check
      if (file.type.startsWith('image/')) {
        const needsCrop = await checkAspectRatio(file);
        if (needsCrop) {
          // Determine if we crop now or queue it
          // Simple flow: Crop one at a time.
          // If multiple files need crop, we might need a more complex queue UI.
          // For MVP: If ANY file needs crop, trigger crop for the FIRST one causing issue
          setCropFile(file);
          setCropImageSrc(URL.createObjectURL(file));

          // Add remaining files to queue to process after this crop
          const remaining = files.filter(f => f !== file);
          setPendingFiles(remaining);
          return; // Stop processing to handle crop UI
        }
      }

      filesToUpload.push(file);
    }

    if (filesToUpload.length > 0) {
      await uploadFiles(filesToUpload);
    }
  }

  const checkAspectRatio = async (file: File): Promise<boolean> => {
    // Skip for video
    if (!file.type.startsWith('image/')) return false;

    return new Promise<boolean>((resolve) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const ratio = img.width / img.height
        URL.revokeObjectURL(img.src)

        // Platform specifics
        // Instagram is strict: 0.8 to 1.91
        if (platform === 'instagram') {
          if (ratio < 0.8 || ratio > 1.91) resolve(true); // Needs crop
          else resolve(false);
        } else {
          // Others are loose, but let's offer crop if it's Extreme
          if (ratio < 0.5 || ratio > 2.5) resolve(true);
          else resolve(false);
        }
      }
      img.onerror = () => resolve(false)
    })
  }

  const onCropConfirm = async (blob: Blob) => {
    if (!cropFile) return;

    // Create new File from Blob
    const croppedFile = new File([blob], cropFile.name, { type: cropFile.type });

    // Close Modal
    setCropImageSrc(null);
    setCropFile(null);

    // Upload the cropped file
    await uploadFiles([croppedFile]);

    // Process remaining queue
    if (pendingFiles.length > 0) {
      const nextBatch = [...pendingFiles];
      setPendingFiles([]);
      processFiles(nextBatch);
    }
  }

  const onCropCancel = () => {
    setCropImageSrc(null);
    setCropFile(null);
    // Clear queue if canceled? Or just skip this file?
    // Let's process remaining just in case
    if (pendingFiles.length > 0) {
      const nextBatch = [...pendingFiles];
      setPendingFiles([]);
      processFiles(nextBatch);
    }
  }

  const uploadFiles = async (files: File[]) => {
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
      if (newUrls.length > 0) toast.success(`Uploaded ${newUrls.length} file(s)`)

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
      {/* Crop Modal */}
      {cropImageSrc && (
        <ImageCropper
          isOpen={!!cropImageSrc}
          imageSrc={cropImageSrc}
          aspectRatio={getTargetRatio(platform)}
          onCropComplete={onCropConfirm}
          onCancel={onCropCancel}
        />
      )}

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
