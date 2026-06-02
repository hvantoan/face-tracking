import { cn } from '@/lib/utils'
import type { DetectedFace, PickerState } from '@/types/face'

interface SelectedPersonCardProps {
  selectedFace: DetectedFace | null
  highlightedFace: DetectedFace | null
  pickerState: PickerState
  className?: string
}

/** Shows highlighted (during spin) or selected person with glassmorphism style */
export function SelectedPersonCard({ selectedFace, highlightedFace, pickerState, className }: SelectedPersonCardProps) {
  const isSpinning = pickerState === 'spinning'
  const isSelected = pickerState === 'selected'
  const displayFace = selectedFace ?? highlightedFace

  if (!displayFace && !isSpinning) return null

  if (isSpinning && displayFace) {
    return (
      <div
        className={cn(
          'rounded-xl px-4 py-3 text-center animate-pulse',
          'bg-white/10 backdrop-blur-md border border-white/20',
          className,
        )}
      >
        <p className="text-lg font-semibold text-white">{displayFace.label}</p>
        <p className="text-xs text-white/60 mt-1">Đang chọn...</p>
      </div>
    )
  }

  if (isSelected && selectedFace) {
    return (
      <div
        className={cn(
          'rounded-xl px-4 py-3 text-center',
          'bg-emerald-500/20 backdrop-blur-md border-2 border-emerald-400/50',
          className,
        )}
      >
        <p className="text-lg font-bold text-white">{selectedFace.label}</p>
        <p className="text-xs text-emerald-300/80 mt-1">✓ Đã chọn</p>
      </div>
    )
  }

  return null
}