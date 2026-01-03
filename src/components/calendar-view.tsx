'use client'

import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css' // Custom styles for the calendar

const localizer = dayjsLocalizer(dayjs)

import { CustomEvent } from './custom-event'
import { useState, useEffect } from 'react'
import { ScheduledPost } from '@/types'
import { LoadingSpinner } from './loading-spinner'
// ... keep other imports

// ... keep localizer

export function CalendarView({ onSelectSlot, defaultView }: { onSelectSlot: (slotInfo: { start: Date; end: Date; }) => void; defaultView: 'month' | 'week' | 'day' }) {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (data.success) {
          const formattedEvents = data.data.map((post: ScheduledPost) => ({
            title: post.content,
            start: new Date(post.scheduled_at),
            end: new Date(new Date(post.scheduled_at).getTime() + 30 * 60000), // Add 30 mins for event duration
            allDay: false,
            resource: {
              platform: post.platform,
              status: post.status,
              media_urls: post.media_urls
            }
          }))
          setEvents(formattedEvents)
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])
  
  if (isLoading) {
    return (
        <div className="h-[85vh] bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    )
  }

  return (
    <div className="h-[85vh] bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor={(event) => event.start as Date}
        endAccessor={(event) => event.end as Date}
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        defaultView={defaultView}
        selectable // Makes the calendar slots clickable
        onSelectSlot={onSelectSlot}
        components={{
          event: CustomEvent, // Use our custom component for events
        }}
        eventPropGetter={(event) => ({
            // Remove the default blue background
            className: '!bg-transparent',
        })}
      />
    </div>
  )
}
