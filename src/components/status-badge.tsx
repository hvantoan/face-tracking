import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  isLoading?: boolean
  error?: string | null
  className?: string
}

/** Compact status indicator: green = ready, yellow spinner = loading, red = error */
export function StatusBadge({ isLoading, error, className }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
        'bg-white/15 backdrop-blur-md border border-white/20 shadow-sm',
        className,
      )}
    >
      {error ? (
        <>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
          <span className="text-xs font-medium text-white/90">Lỗi</span>
        </>
      ) : isLoading ? (
        <>
          <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
          <span className="text-xs font-medium text-white/90">Đang tải</span>
        </>
      ) : (
        <>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span className="text-xs font-medium text-white/90">Sẵn sàng</span>
        </>
      )}
    </div>
  )
}