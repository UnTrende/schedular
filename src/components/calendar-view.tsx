'use client'

import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css' // Custom styles for the calendar

const localizer = dayjsLocalizer(dayjs)

import { CustomEvent } from './custom-event'
// ... keep other imports

// ... keep localizer

// Mock data with more details
const myEventsList = [
  {
    title: 'Just launched our new website! Check it out and let us know what you think. #webdesign #launchday',
    start: new Date(2026, 0, 5, 10, 0, 0),
    end: new Date(2026, 0, 5, 10, 30, 0),
    allDay: false,
    resource: { platform: 'facebook', status: 'pending', media_urls: ['/placeholder.png'] }
  },
  {
    title: 'A beautiful shot of our new office space. Feeling inspired!',
    start: new Date(2026, 0, 6, 14, 0, 0),
    end: new Date(2026, 0, 6, 14, 30, 0),
    allDay: false,
    resource: { platform: 'instagram', status: 'published' }
  },
   {
    title: 'Big announcement coming tomorrow, stay tuned!',
    start: new Date(2026, 0, 6, 18, 0, 0),
    end: new Date(2026, 0, 6, 18, 30, 0),
    allDay: false,
    resource: { platform: 'twitter', status: 'failed' }
  },
]

export function CalendarView() {
  const handleSelectSlot = (slotInfo: any) => {
    // For now, just log the selected slot. Later, this will open the Create Post modal.
    console.log('Selected slot:', slotInfo.start)
    alert(`You selected the slot starting at: ${slotInfo.start}`)
  }

  return (
    <div className="h-[85vh] bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        selectable // Makes the calendar slots clickable
        onSelectSlot={handleSelectSlot}
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
