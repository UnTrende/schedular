'use client'

import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import './calendar-styles.css'

const localizer = dayjsLocalizer(dayjs)
// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

import { CustomEvent } from './custom-event'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { ScheduledPost } from '@/types'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EventDetailsModal } from './event-details-modal'
import { useToast } from '@/components/providers/toast-provider'
import { useRouter } from 'next/navigation'
import { CalendarProvider } from './calendar-context'
import { DailyGridView } from './daily-grid-view'
import { WeeklyGridView } from './weekly-grid-view'

export function CalendarView({ onSelectSlot, defaultView }: { onSelectSlot: (slotInfo: { start: Date; end: Date; }) => void; defaultView: 'month' | 'week' | 'day' }) {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState(defaultView)
  
  const toast = useToast()
  const router = useRouter()

  const { views } = useMemo(() => ({
    views: {
      month: true,
      week: WeeklyGridView,
      day: DailyGridView
    }
  }), [])

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      if (data.success) {
        const formattedEvents = data.data.map((post: ScheduledPost) => ({
          title: post.content,
          start: new Date(post.scheduled_at),
          end: new Date(new Date(post.scheduled_at).getTime() + 60 * 60000), // Default 1 hour duration
          allDay: false,
          resource: {
            id: post.id,
            platform: post.platform,
            status: post.status,
            media_urls: post.media_urls
          }
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      toast.error("Failed to load calendar events")
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const onEventDrop = async ({ event, start, end }: any) => {
    const { resource } = event
    
    // Don't allow moving published or failed posts easily without warning (or just disable it)
    if (resource.status !== 'pending') {
        toast.error(`Cannot reschedule ${resource.status} posts`)
        return
    }
    
    // Optimistic Update
    const oldEvents = [...events]
    const updatedEvent = { ...event, start, end }
    const nextEvents = events.map(e => e.resource.id === resource.id ? updatedEvent : e)
    setEvents(nextEvents)

    try {
        const response = await fetch(`/api/posts/${resource.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduled_at: start.toISOString() })
        })

        if (!response.ok) throw new Error('Failed to update')
        
        toast.success(`Rescheduled to ${dayjs(start).format('MMM D, h:mm A')}`)
    } catch (error) {
        toast.error("Failed to reschedule post")
        setEvents(oldEvents) // Revert
    }
  }

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled post?')) return

    try {
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
        if (response.ok) {
            setEvents(events.filter(e => e.resource.id !== id))
            toast.success("Post deleted")
            router.refresh()
        } else {
            toast.error("Failed to delete post")
        }
    } catch (error) {
        toast.error("Error deleting post")
    }
  }

  const handleViewChange = (newView: any) => {
    setView(newView)
  }

  if (isLoading) {
    return (
        <div className="h-[85vh] bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    )
  }

  return (
    <CalendarProvider value={view}>
      <div className="h-[85vh] bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(event: any) => event.start}
          endAccessor={(event: any) => event.end}
          style={{ height: '100%' }}
          views={views}
          defaultView={defaultView}
          view={view} // Controlled view state
          onView={handleViewChange} // Update state on change
          selectable
          resizable={false} // Disable resizing duration for now, just moving
          onSelectSlot={onSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={onEventDrop}
          components={{
            event: CustomEvent,
          }}
          eventPropGetter={() => ({
              className: '!bg-transparent',
          })}
        />
      </div>

      <EventDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onDelete={handleDeletePost}
      />
    </CalendarProvider>
  )
}
