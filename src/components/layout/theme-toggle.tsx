'use client'

import { useTheme } from '@/components/providers/theme-provider'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
        {resolvedTheme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  )
}
