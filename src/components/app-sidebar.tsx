import { FaceCounter } from '@/components/face-counter'
import { RandomPickerButton } from '@/components/random-picker-button'
import { SelectedPersonCard } from '@/components/selected-person-card'
import type { DetectedFace, PickerState } from '@/types/face'

interface AppSidebarProps {
  pickerState: PickerState
  faceCount: number
  selectedIndex: number | null
  highlightedIndex: number | null
  faces: DetectedFace[]
  onPick: () => void
  disabled?: boolean
  isLoading?: boolean
  error?: string | null
}

export function AppSidebar({
  pickerState,
  faceCount,
  selectedIndex,
  highlightedIndex,
  faces,
  onPick,
  disabled,
  isLoading,
  error,
}: AppSidebarProps) {
  const selectedFace = selectedIndex !== null ? faces[selectedIndex] ?? null : null
  const highlightedFace = highlightedIndex !== null ? faces[highlightedIndex] ?? null : null

  return (
    <aside className="w-full md:w-80 md:min-h-svh border-t md:border-t-0 md:border-r border-border bg-card flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-6 p-4 md:p-6">
      <div className="flex flex-col md:items-stretch items-center gap-4 md:gap-6 md:w-full">
        {/* Title — hidden on mobile to save space */}
        <div className="hidden md:block">
          <h1 className="text-lg font-bold tracking-tight">Chọn Người Phát Biểu</h1>
          <p className="text-xs text-muted-foreground mt-1">Nhận diện & chọn ngẫu nhiên</p>
        </div>

        {/* Pick button */}
        <RandomPickerButton
          state={pickerState}
          onPick={onPick}
          disabled={disabled}
        />

        {/* Face count */}
        <FaceCounter count={faceCount} />

        {/* Selected person card */}
        <SelectedPersonCard
          selectedFace={selectedFace}
          highlightedFace={highlightedFace}
          pickerState={pickerState}
        />

        {/* Loading indicator */}
        {isLoading && (
          <p className="text-xs text-muted-foreground text-center animate-pulse">
            Đang tải model...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </aside>
  )
}