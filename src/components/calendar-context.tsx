'use client'

import { createContext, useContext } from 'react'

type ViewType = 'month' | 'week' | 'day'

const CalendarContext = createContext<ViewType>('month')

export const useCalendarView = () => useContext(CalendarContext)
export const CalendarProvider = CalendarContext.Provider
