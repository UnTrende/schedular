import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { MobileNav } from '@/components/mobile-nav'
import { UserButton } from '@/components/user-button'

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {/* App Sidebar (Desktop) */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                
                {/* Mobile Header (Global) */}
                <header className="md:hidden h-14 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-30">
                    <MobileNav />
                    
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="size-8 flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 rounded-lg text-white shadow-md">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                        </div>
                        <span className="font-heading font-bold text-slate-900 dark:text-white">Social Scheduler</span>
                    </Link>

                    <UserButton />
                </header>

                {/* Ambient "Spectrum" Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
                    <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-amber-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-y-auto p-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
