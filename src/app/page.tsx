import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  // If user is already signed in, redirect to dashboard
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-xl mb-4">
          <span className="material-symbols-outlined text-primary text-6xl">
            calendar_month
          </span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Social Scheduler
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-md">
          Your all-in-one social media command center
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/sign-in" className="btn-primary">
            Get Started
          </Link>
          <Link href="/sign-up" className="btn-secondary">
            Create Account
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </main>
  )
}
