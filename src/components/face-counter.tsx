import { cn } from '@/lib/utils'

interface FaceCounterProps {
  count: number
  /** Compact mode: inline badge for mobile landscape */
  compact?: boolean
  className?: string
}

/** Displays detected face count — full card for desktop, compact badge for mobile */
export function FaceCounter({ count, compact, className }: FaceCounterProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
          'bg-white/15 backdrop-blur-md border border-white/20 shadow-sm',
          className,
        )}
      >
        <span className="text-lg font-bold tabular-nums text-white">
          {count}
        </span>
        <span className="text-xs text-white/70">người</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-2xl p-4',
        'bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg',
        className,
      )}
    >
      <span className="text-4xl font-bold tabular-nums tracking-tight text-white">
        {count}
      </span>
      <span className="text-xs text-white/70">người phát hiện</span>
    </div>
  )
}