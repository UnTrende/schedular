import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { CalendarView } from '@/components/calendar-view'
import { SocialProfilesSidebar } from '@/components/social-profiles-sidebar'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-card-dark border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
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
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Social Profiles Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 p-4">
            <SocialProfilesSidebar />
        </div>

        {/* Main Calendar View */}
        <div className="flex-1 p-6 bg-slate-50">
            <CalendarView />
        </div>
      </div>
    </div>
  )
}
