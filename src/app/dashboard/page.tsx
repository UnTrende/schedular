'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { CalendarView } from '@/components/calendar-view'
import { SocialProfilesSidebar } from '@/components/social-profiles-sidebar'
import { PostCreationForm } from '@/components/post-creation-form'

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start)
    setIsCreateModalOpen(true)
  }

  const handlePostCreated = () => {
    setIsCreateModalOpen(false)
    // Here you would typically trigger a refetch of the calendar events
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-card-dark border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Content Calendar
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Placeholder for view switchers */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <Button variant="ghost" size="sm" className="bg-white">Month</Button>
              <Button variant="ghost" size="sm">Week</Button>
              <Button variant="ghost" size="sm">List</Button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>New Post</Button>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Social Profiles Sidebar */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
              <SocialProfilesSidebar />
          </div>

          {/* Main Calendar View */}
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
              <CalendarView onSelectSlot={handleSelectSlot} />
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
