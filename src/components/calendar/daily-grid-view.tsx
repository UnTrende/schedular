'use client'

import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { CustomEvent } from './custom-event'
import { Navigate } from 'react-big-calendar'
import { clsx } from 'clsx'

interface DailyGridViewProps {
  date: Date
  events: any[]
  onSelectEvent: (event: any) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[]; action: 'click' | 'select' }) => void
}

export function DailyGridView({ date, events, onSelectEvent, onSelectSlot }: DailyGridViewProps) {
  // Generate 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Filter events for the current day
  const dailyEvents = useMemo(() => {
    return events.filter(event => 
      dayjs(event.start).isSame(date, 'day')
    )
  }, [events, date])

  // Group events by hour
  const eventsByHour = useMemo(() => {
    const groups: Record<number, any[]> = {}
    dailyEvents.forEach(event => {
      const hour = dayjs(event.start).hour()
      if (!groups[hour]) groups[hour] = []
      groups[hour].push(event)
    })
    return groups
  }, [dailyEvents])

  const handleSlotClick = (hour: number) => {
    if (onSelectSlot) {
      const start = dayjs(date).hour(hour).minute(0).toDate()
      const end = dayjs(date).hour(hour).minute(59).toDate()
      onSelectSlot({
        start,
        end,
        slots: [start],
        action: 'click'
      })
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
        {hours.map(hour => {
          const hourEvents = eventsByHour[hour] || []
          const timeLabel = dayjs(date).hour(hour).format('h A')
          const isCurrentHour = dayjs().isSame(date, 'day') && dayjs().hour() === hour
          
          return (
            <div 
              key={hour}
              onClick={() => handleSlotClick(hour)}
              className={clsx(
                "min-h-[140px] rounded-xl border p-3 flex flex-col gap-2 transition-all cursor-pointer group",
                isCurrentHour 
                  ? "bg-slate-50 dark:bg-slate-800/80 border-primary/30 ring-1 ring-primary/20 shadow-sm" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-1">
                <span className={clsx(
                  "text-sm font-bold",
                  isCurrentHour ? "text-primary" : "text-slate-400"
                )}>
                  {timeLabel}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-slate-300 text-sm">add</span>
                </div>
              </div>

              {/* Events Container */}
              <div className="flex-1 flex flex-col gap-2">
                {hourEvents.length > 0 ? (
                  hourEvents.map((event, idx) => (
                    <div key={idx} onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}>
                      <CustomEvent event={event} />
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-200 dark:text-slate-800 text-xs italic">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Required static properties for RBC View
DailyGridView.range = (date: Date) => {
  return [date]
}

DailyGridView.navigate = (date: Date, action: 'PREV' | 'NEXT' | 'TODAY') => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dayjs(date).add(-1, 'day').toDate()
    case Navigate.NEXT:
      return dayjs(date).add(1, 'day').toDate()
    default:
      return date
  }
}

DailyGridView.title = (date: Date) => {
  return dayjs(date).format('dddd, MMMM D, YYYY')
}
