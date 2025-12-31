'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ToastMessage } from '@/types'

export function ToastContainer({ toasts, onRemove }: { 
  toasts: ToastMessage[]
  onRemove: (id: string) => void 
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: { icon: 'check_circle', color: 'text-green-500' },
    error: { icon: 'error', color: 'text-red-500' },
    warning: { icon: 'warning', color: 'text-yellow-500' },
    info: { icon: 'info', color: 'text-blue-500' },
  }

  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  }

  const { icon, color } = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right duration-300',
        isExiting && 'animate-out slide-out-to-right duration-300',
        backgrounds[toast.type]
      )}
    >
      <span className={cn('material-symbols-outlined text-2xl', color)}>
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  )
}
