import type { DetectedFace, PickerState } from '@/types/face'

interface SelectedPersonCardProps {
  selectedFace: DetectedFace | null
  highlightedFace: DetectedFace | null
  pickerState: PickerState
}

export function SelectedPersonCard({ selectedFace, highlightedFace, pickerState }: SelectedPersonCardProps) {
  const isSpinning = pickerState === 'spinning'
  const isSelected = pickerState === 'selected'
  const displayFace = selectedFace ?? highlightedFace

  if (!displayFace && !isSpinning) return null

  if (isSpinning && displayFace) {
    return (
      <div className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 text-center animate-pulse">
        <p className="text-lg font-semibold text-accent-foreground">{displayFace.label}</p>
        <p className="text-xs text-muted-foreground mt-1">Đang chọn...</p>
      </div>
    )
  }

  if (isSelected && selectedFace) {
    return (
      <div className="rounded-lg border-2 border-primary bg-primary/15 px-4 py-3 text-center">
        <p className="text-lg font-bold text-primary">{selectedFace.label}</p>
        <p className="text-xs text-primary/80 mt-1">✓ Đã chọn</p>
      </div>
    )
  }

  return null
}