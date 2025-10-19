import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-400/30',
    green: 'bg-green-500/15 text-green-400 border-green-400/30',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-400/30',
    red: 'bg-red-500/15 text-red-400 border-red-400/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-400/30',
    gray: 'bg-foreground/10 text-foreground/80 border-foreground/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border',
      variants[variant]
    )}>
      {children}
    </span>
  )
}
