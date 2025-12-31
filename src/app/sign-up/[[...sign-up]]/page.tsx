import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
            <span className="material-symbols-outlined text-primary text-5xl">
              calendar_month
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Get Started
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Create your Social Scheduler account
          </p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700',
            },
          }}
        />
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  )
}
