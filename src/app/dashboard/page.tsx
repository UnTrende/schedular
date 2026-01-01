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
      <main className="min-h-screen p-4 md:p-6 bg-slate-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto bg-white dark:bg-card-dark rounded-[2.5rem] p-8 md:p-12 shadow-[0_2px_40px_rgba(0,0,0,0.04)] min-h-[85vh]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                Welcome to your Social Scheduler
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <Link href="/create-post">
                  <Button variant="primary" size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
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
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
            <EmptyState
              icon="post_add"
              title="No posts yet"
              description="Get started by connecting your social media accounts and creating your first scheduled post."
              action={
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href="/create-post">
                    <Button variant="primary" size="md" className="rounded-full px-8">
                      <span className="material-symbols-outlined text-xl mr-2">add</span>
                      <span>Create Post</span>
                    </Button>
                  </Link>
                  <Link href="/connections">
                    <Button variant="secondary" size="md" className="rounded-full px-8 bg-white shadow-sm border-0 ring-1 ring-slate-200">
                      <span className="material-symbols-outlined text-xl mr-2">link</span>
                      <span>Connect Accounts</span>
                    </Button>
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </main>
    </>
  )
}
