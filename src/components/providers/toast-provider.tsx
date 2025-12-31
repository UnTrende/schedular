'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '@/components/ui'
import { ToastMessage } from '@/types'

interface ToastContextType {
  addToast: (message: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const toast: ToastMessage = { ...message, id }
    setToasts((prev) => [...prev, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string) => {
    addToast({ type: 'success', message })
  }, [addToast])

  const error = useCallback((message: string) => {
    addToast({ type: 'error', message })
  }, [addToast])

  const warning = useCallback((message: string) => {
    addToast({ type: 'warning', message })
  }, [addToast])

  const info = useCallback((message: string) => {
    addToast({ type: 'info', message })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
