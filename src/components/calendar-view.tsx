'use client'

import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css' // Custom styles for the calendar

const localizer = dayjsLocalizer(dayjs)

// Mock data for now
const myEventsList = [
  {
    title: 'Post to Facebook',
    start: new Date(2026, 0, 5, 10, 0, 0),
    end: new Date(2026, 0, 5, 10, 30, 0),
    allDay: false,
    resource: { platform: 'facebook' }
  },
  {
    title: 'Instagram Story',
    start: new Date(2026, 0, 6, 14, 0, 0),
    end: new Date(2026, 0, 6, 14, 30, 0),
    allDay: false,
    resource: { platform: 'instagram' }
  },
]

export function CalendarView() {
  return (
    <div className="h-[85vh] bg-white dark:bg-card-dark p-6 rounded-lg shadow-sm">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        // Add more props for customization later
      />
    </div>
  )
}
