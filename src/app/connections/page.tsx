import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ConnectionsList } from '@/components/connections-list'

export default async function ConnectionsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              Social Connections
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
              Connect and manage your social media accounts
            </p>
          </div>

          {/* Connections List */}
          <ConnectionsList />
        </div>
      </main>
    </>
  )
}
