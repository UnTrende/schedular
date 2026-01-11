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
  platforms: Platform[] // Replaced single platform with array
}

export function MediaUploader({ onUploadComplete, maxFiles = 4, existingUrls = [], platforms }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const toast = useToast()

  // Cropper State
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [targetRatio, setTargetRatio] = useState<number>(1)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  const getTargetRatio = (p: Platform) => {
    switch (p) {
      case 'instagram': return 4 / 5;
      case 'twitter': return 16 / 9;
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
    if (uploadedUrls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    const filesToUpload: File[] = []

    for (const file of files) {
      if (file.size > FILE_UPLOAD.maxSize) {
        toast.error(`File ${file.name} is too large. Max size: ${formatFileSize(FILE_UPLOAD.maxSize)}`)
        continue
      }

      if (!FILE_UPLOAD.acceptedTypes.includes(file.type as any)) {
        toast.error(`File type ${file.type} is not supported`)
        continue
      }

      if (file.type.startsWith('image/')) {
        const mismatchPlatform = await checkMultiPlatformRatio(file);
        if (mismatchPlatform) {
          const ratio = getTargetRatio(mismatchPlatform);
          setTargetRatio(ratio);
          setCropFile(file);
          setCropImageSrc(URL.createObjectURL(file));

          const remaining = files.filter(f => f !== file);
          setPendingFiles(remaining);
          return;
        }
      }
      filesToUpload.push(file);
    }

    if (filesToUpload.length > 0) {
      await uploadFiles(filesToUpload);
    }
  }

  const checkMultiPlatformRatio = async (file: File): Promise<Platform | null> => {
    if (!file.type.startsWith('image/')) return null;

    return new Promise((resolve) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const ratio = img.width / img.height
        URL.revokeObjectURL(img.src)

        // Find the first platform that fails
        for (const p of platforms) {
          if (p === 'instagram') {
            if (ratio < 0.8 || ratio > 1.91) {
              resolve(p);
              return;
            }
          } else {
            if (ratio < 0.5 || ratio > 2.5) {
              resolve(p);
              return;
            }
          }
        }
        resolve(null);
      }
      img.onerror = () => resolve(null)
    })
  }

  const onCropConfirm = async (blob: Blob) => {
    if (!cropFile) return;

    const croppedFile = new File([blob], cropFile.name.replace(/\.[^/.]+$/, "") + ".jpg", {
      type: 'image/jpeg'
    });

    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);

    setCropImageSrc(null);
    setCropFile(null);

    await uploadFiles([croppedFile]);

    if (pendingFiles.length > 0) {
      const nextBatch = [...pendingFiles];
      setPendingFiles([]);
      processFiles(nextBatch);
    }
  }

  const onCropCancel = () => {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
    }
    setCropImageSrc(null);
    setCropFile(null);

    // Process remaining queue
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
          aspectRatio={targetRatio}
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
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!url.match(/\.(mp4|mov)$/i) && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const file = new File([blob], "image.jpg", { type: 'image/jpeg' });
                        setCropFile(file);
                        setCropImageSrc(URL.createObjectURL(blob));
                        setTargetRatio(getTargetRatio(platforms[0])); // Default to first platform
                        // We also need to remove it from current list once re-cropped
                        handleRemove(url);
                      } catch (e) {
                        toast.error("Failed to load image for cropping");
                      }
                    }}
                    className="p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">crop</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
