import { StatusBadge } from '@/components/status-badge'
import { FaceCounter } from '@/components/face-counter'
import { RandomPickerButton } from '@/components/random-picker-button'
import type { PickerState } from '@/types/face'

interface MobileOverlayProps {
  pickerState: PickerState
  faceCount: number
  onPick: () => void
  disabled?: boolean
  isLoading?: boolean
  error?: string | null
}

/** Overlay controls for mobile — portrait layout (status top-left, count top-right, button bottom-center) */
export function MobilePortraitOverlay({
  pickerState,
  faceCount,
  onPick,
  disabled,
  isLoading,
  error,
}: MobileOverlayProps) {
  return (
    <div className="flex landscape:hidden lg:hidden absolute inset-0 pointer-events-none p-4 pb-8">
      {/* Top row: status left, count right */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <StatusBadge isLoading={isLoading} error={error} />
      </div>
      <div className="absolute top-4 right-4 pointer-events-auto">
        <FaceCounter count={faceCount} compact />
      </div>

      {/* Bottom center: select button 56×56 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <RandomPickerButton
          state={pickerState}
          onPick={onPick}
          disabled={disabled}
          iconOnly
        />
      </div>
    </div>
  )
}

/** Overlay controls for mobile — landscape layout (status+count top-left, button right-center) */
export function MobileLandscapeOverlay({
  pickerState,
  faceCount,
  onPick,
  disabled,
  isLoading,
  error,
}: MobileOverlayProps) {
  return (
    <div className="hidden landscape:flex lg:hidden absolute inset-0 pointer-events-none">
      {/* Top-left: status + count grouped */}
      <div className="absolute top-4 left-4 flex items-center gap-3 pointer-events-auto">
        <StatusBadge isLoading={isLoading} error={error} />
        <FaceCounter count={faceCount} compact />
      </div>

      {/* Right-center: select button 56×56 — right thumb zone */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <RandomPickerButton
          state={pickerState}
          onPick={onPick}
          disabled={disabled}
          iconOnly
        />
      </div>
    </div>
  )
}