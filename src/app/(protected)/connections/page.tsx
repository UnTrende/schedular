import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ConnectionsList } from '@/components/dashboard/connections-list'
import { getUserConnections } from '@/lib/db/connections'

export default async function ConnectionsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const { data: connections } = await getUserConnections(userId)

  return (
    <div className="p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header - Centered on mobile, matching Scheduled Posts style */}
        <div className="mb-10 text-center sm:text-left space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-gradient pb-1">
            Social Connections
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Connect and manage your social media accounts
          </p>
        </div>

        {/* Connections List - Wrapped in a small padding for shadow room */}
        <div className="p-1">
          <ConnectionsList initialConnections={connections || []} />
        </div>
      </div>
    </div>
  )
}
