import { Button } from '@/components/ui/button'
import type { PickerState } from '@/types/face'

interface RandomPickerButtonProps {
  state: PickerState
  onPick: () => void
  disabled?: boolean
}

export function RandomPickerButton({ state, onPick, disabled }: RandomPickerButtonProps) {
  const isSpinning = state === 'spinning'
  const label = state === 'selected' ? 'CHỌN LẠI' : 'CHỌN'

  return (
    <Button
      size="lg"
      className="w-full md:w-full text-base font-bold px-6 h-11"
      onClick={onPick}
      disabled={isSpinning || disabled}
    >
      {isSpinning ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Đang chọn...
        </span>
      ) : (
        label
      )}
    </Button>
  )
}