'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'

interface ScheduleTimePickerProps {
  value: string
  onChange: (value: string) => void
  minDate?: Date
}

export function ScheduleTimePicker({ value, onChange, minDate }: ScheduleTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  // Get minimum datetime (5 minutes from now by default) in local timezone
  const getMinDateTime = () => {
    const min = minDate || new Date()
    min.setMinutes(min.getMinutes() + 5)
    // Format for datetime-local input in user's local timezone
    const year = min.getFullYear()
    const month = String(min.getMonth() + 1).padStart(2, '0')
    const day = String(min.getDate()).padStart(2, '0')
    const hours = String(min.getHours()).padStart(2, '0')
    const minutes = String(min.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleSave = () => {
    onChange(tempValue)
    setIsOpen(false)
  }

  // Quick schedule options (local timezone)
  const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const quickOptions = [
    { label: 'In 1 hour', getValue: () => {
      const date = new Date()
      date.setHours(date.getHours() + 1)
      return formatLocalDateTime(date)
    }},
    { label: 'Tomorrow 9 AM', getValue: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0)
      return formatLocalDateTime(date)
    }},
    { label: 'In 1 week', getValue: () => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return formatLocalDateTime(date)
    }},
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary transition-colors"
      >
        {value ? (
          <span>{formatDateTime(value)}</span>
        ) : (
          <span className="text-slate-400">Select schedule time...</span>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Schedule Time"
        description="Choose when to publish this post"
        size="md"
      >
        <div className="space-y-4">
          {/* Quick Options */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Quick Options
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setTempValue(option.getValue())}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date/Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Custom Date & Time
            </label>
            <input
              type="datetime-local"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              min={getMinDateTime()}
              className="w-full rounded-lg border px-4 py-2.5 text-sm border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Posts must be scheduled at least 5 minutes in the future
            </p>
          </div>

          {/* Preview */}
          {tempValue && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>Will be published:</strong> {formatDateTime(tempValue)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={!tempValue}
            >
              <span className="material-symbols-outlined text-xl">schedule</span>
              <span>Set Schedule</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
