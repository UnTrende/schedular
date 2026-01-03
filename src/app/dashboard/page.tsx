import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { EmptyState } from '@/components/empty-state'
import { DashboardStats } from '@/components/dashboard-stats'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Welcome to your Social Scheduler
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Link href="/create-post">
                <Button variant="primary" size="lg" className="rounded-lg shadow-sm">
                  <span className="material-symbols-outlined mr-2">add</span>
                  New Post
                </Button>
             </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-10">
          <DashboardStats />
        </div>

        {/* Empty State / Content */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-100 dark:border-slate-800">
          <EmptyState
            icon="post_add"
            title="No posts yet"
            description="Get started by connecting your social media accounts and creating your first scheduled post."
            action={
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/create-post">
                  <Button variant="primary" size="md" className="rounded-lg">
                    <span className="material-symbols-outlined text-xl mr-2">add</span>
                    <span>Create Post</span>
                  </Button>
                </Link>
                <Link href="/connections">
                  <Button variant="secondary" size="md" className="rounded-lg">
                    <span className="material-symbols-outlined text-xl mr-2">link</span>
                    <span>Connect Accounts</span>
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
