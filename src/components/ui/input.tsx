'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, placeholder, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasValue = value !== '' && value !== undefined

    return (
      <div className="w-full relative group">
        <div className={cn(
          "relative rounded-xl border transition-all duration-300 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm",
          isFocused ? "border-primary ring-4 ring-primary/10" : "border-slate-200 dark:border-slate-800",
          error && "border-red-500",
          className
        )}>
          {/* Animated Bottom Border */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            className="absolute bottom-0 left-0 h-[2px] bg-primary z-10"
          />

          <input
            type={type}
            className={cn(
              'w-full bg-transparent px-4 pt-5 pb-2 text-sm transition-all outline-none',
              'text-slate-900 dark:text-white',
              'placeholder:text-transparent', // Hide default placeholder to use our custom label
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            ref={ref}
            placeholder={placeholder} // Keep for a11y, but hidden visually via transparent text
            value={value}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none text-slate-500 dark:text-slate-400",
              (isFocused || hasValue || props.defaultValue)
                ? "top-1 text-[10px] font-medium text-primary"
                : "top-3.5 text-sm"
            )}>
              {label || placeholder}
            </label>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-red-500 font-medium pl-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
