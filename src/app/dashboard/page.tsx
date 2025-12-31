import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui'
import { DashboardStats } from '@/components/dashboard-stats'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
              Welcome to your Social Scheduler dashboard
            </p>
          </div>

          {/* Quick Stats */}
          <DashboardStats />

          {/* Empty State */}
          <Card>
            <EmptyState
              icon="post_add"
              title="No posts yet"
              description="Get started by connecting your social media accounts and creating your first scheduled post."
              action={
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/create-post">
                    <Button variant="primary" size="md">
                      <span className="material-symbols-outlined text-xl">add</span>
                      <span>Create Post</span>
                    </Button>
                  </Link>
                  <Link href="/connections">
                    <Button variant="secondary" size="md">
                      <span className="material-symbols-outlined text-xl">link</span>
                      <span>Connect Accounts</span>
                    </Button>
                  </Link>
                </div>
              }
            />
          </Card>
        </div>
      </main>
    </>
  )
}
