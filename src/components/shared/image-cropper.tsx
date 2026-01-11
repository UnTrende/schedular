'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

interface ImageCropperProps {
    imageSrc: string
    aspectRatio: number // e.g., 1 or 4/5 or 16/9
    onCropComplete: (croppedImageBlob: Blob) => void
    onCancel: () => void
    isOpen: boolean
}

export function ImageCropper({ imageSrc, aspectRatio, onCropComplete, onCancel, isOpen }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        if (!croppedAreaPixels) return

        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedImage) {
                onCropComplete(croppedImage)
            } else {
                throw new Error('Failed to generate cropped image')
            }
        } catch (e) {
            console.error('Crop failed:', e)
            alert('Failed to crop image. Please try again.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-950 border-none overflow-hidden p-0">
                {/* Aurora Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-heading bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            Refine Your Vision
                        </DialogTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Adjust your image to fit the platform&apos;s perfect frame.
                        </p>
                    </DialogHeader>

                    <div className="relative w-full h-[450px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-inner ring-1 ring-slate-200 dark:ring-slate-800">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteHandler}
                            onZoomChange={onZoomChange}
                            classes={{
                                containerClassName: "cursor-move",
                                cropAreaClassName: "ring-2 ring-primary ring-offset-2 ring-offset-black/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] !border-none",
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">zoom_in</span>
                                Zoom Level
                            </span>
                            <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                {zoom.toFixed(1)}x
                            </span>
                        </div>
                        <Slider
                            defaultValue={[1]}
                            min={1}
                            max={3}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(vals) => setZoom(vals[0])}
                            className="py-2"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={onCancel} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Confirm Selection
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Helper to create the cropped image blob
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'))
                return
            }
            resolve(blob)
        }, 'image/jpeg', 0.9) // High quality jpeg
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))

        // ONLY set crossOrigin if it's not a local blob URL
        // Setting crossOrigin on blobs can block canvas access in some browsers (e.g. Safari/Vercel environments)
        if (!url.startsWith('blob:')) {
            image.setAttribute('crossOrigin', 'anonymous')
        }

        image.src = url
    })
}
