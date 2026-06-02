import { Shuffle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PickerState } from '@/types/face'

interface RandomPickerButtonProps {
  state: PickerState
  onPick: () => void
  disabled?: boolean
  /** Icon-only 56×56 circular button for mobile overlays */
  iconOnly?: boolean
  className?: string
}

export function RandomPickerButton({ state, onPick, disabled, iconOnly, className }: RandomPickerButtonProps) {
  const isSpinning = state === 'spinning'
  const isSelected = state === 'selected'

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onPick}
        disabled={isSpinning || disabled}
        className={cn(
          'flex items-center justify-center rounded-full',
          'w-14 h-14 touch-manipulation cursor-pointer',
          'transition-all duration-200 active:scale-95',
          'shadow-lg shadow-black/30',
          // Glass style
          'bg-white/20 backdrop-blur-md border border-white/30',
          'hover:bg-white/30 hover:border-white/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Selected state: accent color
          isSelected && 'bg-emerald-500/80 border-emerald-400/50 hover:bg-emerald-500/90',
          className,
        )}
        aria-label={isSelected ? 'Chọn lại' : 'Chọn người phát biểu'}
      >
        {isSpinning ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : isSelected ? (
          <RotateCcw className="h-6 w-6 text-white" />
        ) : (
          <Shuffle className="h-6 w-6 text-white" />
        )}
      </button>
    )
  }

  return (
    <Button
      size="lg"
      className={cn(
        'w-full text-base font-bold px-6 h-11',
        'bg-white/20 backdrop-blur-md border border-white/30',
        'hover:bg-white/30 hover:border-white/40',
        'text-white',
        isSelected && 'bg-emerald-500/80 border-emerald-400/50 hover:bg-emerald-500/90',
        className,
      )}
      onClick={onPick}
      disabled={isSpinning || disabled}
    >
      {isSpinning ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Đang chọn...
        </span>
      ) : isSelected ? (
        <span className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          CHỌN LẠI
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Shuffle className="h-4 w-4" />
          CHỌN
        </span>
      )}
    </Button>
  )
}