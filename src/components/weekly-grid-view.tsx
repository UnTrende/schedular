'use client'

import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { CustomEvent } from './custom-event'
import { Navigate } from 'react-big-calendar'
import { clsx } from 'clsx'

interface WeeklyGridViewProps {
  date: Date
  events: any[]
  onSelectEvent: (event: any) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[]; action: 'click' | 'select' }) => void
}

export function WeeklyGridView({ date, events, onSelectEvent, onSelectSlot }: WeeklyGridViewProps) {
  // Generate 7 days start from start of week
  const startOfWeek = dayjs(date).startOf('week')
  const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'))

  // Filter events for the current week
  const weeklyEvents = useMemo(() => {
    return events.filter(event => 
      dayjs(event.start).isAfter(startOfWeek.subtract(1, 'minute')) &&
      dayjs(event.start).isBefore(startOfWeek.add(7, 'day'))
    )
  }, [events, startOfWeek])

  // Group events by day
  const eventsByDay = useMemo(() => {
    const groups: Record<string, any[]> = {}
    weeklyEvents.forEach(event => {
      const dayKey = dayjs(event.start).format('YYYY-MM-DD')
      if (!groups[dayKey]) groups[dayKey] = []
      groups[dayKey].push(event)
    })
    return groups
  }, [weeklyEvents])

  const handleSlotClick = (dayDate: dayjs.Dayjs) => {
    if (onSelectSlot) {
      // Default to 9 AM
      const start = dayDate.hour(9).minute(0).toDate()
      const end = dayDate.hour(10).minute(0).toDate()
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
        {days.map((dayDate, idx) => {
          const dayKey = dayDate.format('YYYY-MM-DD')
          const dayEvents = eventsByDay[dayKey] || []
          const isToday = dayDate.isSame(dayjs(), 'day')
          
          return (
            <div 
              key={dayKey}
              onClick={() => handleSlotClick(dayDate)}
              className={clsx(
                "min-h-[250px] rounded-2xl border p-4 flex flex-col gap-3 transition-all cursor-pointer group hover:shadow-lg",
                isToday 
                  ? "bg-slate-50 dark:bg-slate-800/80 border-primary/40 ring-1 ring-primary/20" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3 mb-1">
                <div className="flex flex-col">
                    <span className={clsx(
                        "text-xs font-bold uppercase tracking-wider",
                        isToday ? "text-primary" : "text-slate-400"
                    )}>
                        {dayDate.format('dddd')}
                    </span>
                    <span className={clsx(
                        "text-2xl font-black",
                        isToday ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                    )}>
                        {dayDate.format('D')}
                    </span>
                </div>
                {isToday && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">
                        TODAY
                    </span>
                )}
              </div>

              {/* Events Container */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                {dayEvents.length > 0 ? (
                  dayEvents.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((event, idx) => (
                    <div key={idx} onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}>
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
                          {dayjs(event.start).format('h:mm A')}
                      </div>
                      <CustomEvent event={event} />
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-slate-300">add</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Add Post</span>
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
WeeklyGridView.range = (date: Date) => {
  const start = dayjs(date).startOf('week')
  const end = dayjs(date).endOf('week')
  return [start.toDate(), end.toDate()]
}

WeeklyGridView.navigate = (date: Date, action: 'PREV' | 'NEXT' | 'TODAY') => {
  switch (action) {
    case Navigate.PREV:
      return dayjs(date).add(-1, 'week').toDate()
    case Navigate.NEXT:
      return dayjs(date).add(1, 'week').toDate()
    default:
      return date
  }
}

WeeklyGridView.title = (date: Date) => {
  const start = dayjs(date).startOf('week')
  const end = dayjs(date).endOf('week')
  return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
}
