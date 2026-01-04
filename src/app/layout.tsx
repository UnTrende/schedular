import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Social Scheduler - Your All-in-One Social Media Command Center',
  description: 'Schedule posts across multiple social media platforms with ease',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#14b8a6', // New Primary: Teal
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#1a1a1a',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-teal-700',
          card: 'shadow-lg',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
          <ThemeProvider>
            <ToastProvider>
              <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 text-text-primary-light dark:text-text-primary-dark">
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
