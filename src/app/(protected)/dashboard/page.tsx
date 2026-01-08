'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { CalendarView } from '@/components/calendar/calendar-view'
import { SocialProfilesSidebar } from '@/components/layout/social-profiles-sidebar'
import { PostCreationForm } from '@/components/posts/post-creation-form'

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
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
        {/* Top Header Bar - Desktop only for Title, Mobile handled by Global Layout */}
        <header className="hidden md:flex bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading text-gradient">
              Content Calendar
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Actions */}
            <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="hidden sm:inline ml-1">New Post</span>
            </Button>
          </div>
        </header>

        {/* Mobile Action Bar (since we hid the desktop header on mobile, we need the 'New Post' button somewhere) */}
        <div className="md:hidden p-4 pb-0 flex justify-between items-center">
             <h1 className="text-xl font-bold font-heading text-gradient">
              Calendar
            </h1>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="shadow-md">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>New</span>
            </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Channel Nav (Collapsible Sidebar) - Desktop */}
          <div className="hidden md:block h-full flex-shrink-0 z-20">
            <SocialProfilesSidebar />
          </div>

          {/* Main Calendar View - Fluid Grow */}
          <div className="flex-1 p-2 md:p-4 lg:p-6 overflow-hidden flex flex-col relative z-10">
            <div className="flex-1 bg-white/60 dark:bg-card-dark/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-800 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-all duration-300">
              {/* Calendar component needs to be responsive internally too */}
              <CalendarView onSelectSlot={handleSelectSlot} defaultView={calendarView} />
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Post"
        size="xl"
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
