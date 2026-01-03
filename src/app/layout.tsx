import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Social Scheduler - Your All-in-One Social Media Command Center',
  description: 'Schedule posts across multiple social media platforms with ease',
  icons: {
    icon: '/favicon.ico',
  },
}

import { Navbar } from '@/components/navbar'
// ... (keep existing imports)

// ... (keep metadata)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#2c69ff', // Buffer Blue
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#1a1a1a',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-blue-700',
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
        <body className={`${inter.variable} font-display antialiased`}>
          <ThemeProvider>
            <ToastProvider>
              <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
                <Navbar />
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
