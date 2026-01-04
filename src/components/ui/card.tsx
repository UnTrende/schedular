import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neo'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', ...props }, ref) => {

    const variants = {
      default: "bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm",
      glass: cn(
        "bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl",
        "border border-white/20 dark:border-white/5",
        "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]",
        "relative overflow-hidden"
      ),
      neo: "bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl p-8',
          variants[variant],
          className
        )}
        {...props}
      >
        {/* Subtle noise texture for 'glass' variant */}
        {variant === 'glass' && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        )}
        <div className="relative z-10">
          {props.children}
        </div>
      </div>
    )
  }
)

Card.displayName = 'Card'

// ... Keep existing subcomponents (CardHeader, etc) but update their styles if needed
// Actually, I will rewrite them to be safe and clean

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-6 space-y-1.5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-heading text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-white', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'
