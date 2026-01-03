'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { CalendarView } from '@/components/calendar-view'
import { SocialProfilesSidebar } from '@/components/social-profiles-sidebar'
import { PostCreationForm } from '@/components/post-creation-form'

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start)
    setIsCreateModalOpen(true)
  }

  const handlePostCreated = () => {
    setIsCreateModalOpen(false)
    // Here you would typically trigger a refetch of the calendar events
    // For now, it will refresh on page reload/navigation
  }

  return (
    <>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Content Calendar
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* View Switchers */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <Button 
                variant={calendarView === 'month' ? 'primary' : 'ghost'} 
                size="sm" 
                className="rounded-md"
                onClick={() => setCalendarView('month')}
              >
                Month
              </Button>
              <Button 
                variant={calendarView === 'week' ? 'primary' : 'ghost'} 
                size="sm" 
                className="rounded-md"
                onClick={() => setCalendarView('week')}
              >
                Week
              </Button>
              <Button 
                variant={calendarView === 'day' ? 'primary' : 'ghost'} 
                size="sm" 
                className="rounded-md"
                onClick={() => setCalendarView('day')}
              >
                Day
              </Button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-lg">
                <span className="material-symbols-outlined text-xl">add</span>
                New Post
            </Button>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Social Profiles Sidebar */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
              <SocialProfilesSidebar />
          </div>

          {/* Main Calendar View */}
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
              <CalendarView onSelectSlot={handleSelectSlot} defaultView={calendarView} />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Post"
        size="2xl"
      >
          <div className="mt-4">
            <PostCreationForm 
              initialDate={selectedDate}
              onPostCreated={handlePostCreated}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
      </Modal>
    </>
  )
}
