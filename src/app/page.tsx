import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { BentoGrid } from '@/components/landing/bento-grid'
import { LandingNavbar } from '@/components/landing/landing-navbar'

export default async function Home() {
  // If user is already signed in, redirect to dashboard
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <BentoGrid />

      {/* Footer Simple */}
      <footer className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2026 Social Scheduler. All rights reserved.</p>
      </footer>
    </main>
  )
}
