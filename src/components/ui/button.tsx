'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

// Convert HTMLButtonElement attributes to motion.button props
type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">

export const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

    const variants = {
      primary: cn(
        "relative overflow-hidden text-white shadow-lg shadow-primary/25 border border-white/10",
        "bg-gradient-to-br from-primary via-indigo-600 to-indigo-700",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      ),
      secondary: cn(
        "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200",
        "border border-slate-200/50 dark:border-slate-700/50",
        "hover:bg-white dark:hover:bg-slate-800 hover:border-primary/50 transition-colors"
      ),
      ghost: cn(
        "text-slate-600 dark:text-slate-300",
        "hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-primary transition-colors"
      ),
      danger: cn(
        "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25",
        "border border-red-400/20"
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
      md: 'px-6 py-3 text-base gap-2 rounded-xl',
      lg: 'px-8 py-4 text-lg gap-2.5 rounded-2xl',
      icon: 'size-10 p-2 rounded-xl', // New icon size
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        className={cn(
          'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin text-xl mr-2">
            progress_activity
          </span>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
