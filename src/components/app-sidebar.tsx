import { StatusBadge } from '@/components/status-badge'
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

/** Glass sidebar for desktop (≥1024px) — contains status, count, button, selected card */
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
    <aside
      className={
        'hidden lg:flex w-[280px] shrink-0 flex-col gap-6 p-6 '
        + 'bg-white/5 backdrop-blur-2xl border-l border-white/10 text-white'
      }
    >
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-white">
          Chọn Người Phát Biểu
        </h1>
        <p className="text-xs text-white/50 mt-1">Nhận diện & chọn ngẫu nhiên</p>
      </div>

      {/* Status */}
      <StatusBadge isLoading={isLoading} error={error} />

      {/* Face count */}
      <FaceCounter count={faceCount} />

      {/* Pick button */}
      <RandomPickerButton
        state={pickerState}
        onPick={onPick}
        disabled={disabled}
      />

      {/* Selected person card */}
      <SelectedPersonCard
        selectedFace={selectedFace}
        highlightedFace={highlightedFace}
        pickerState={pickerState}
      />

      {/* Loading indicator */}
      {isLoading && (
        <p className="text-xs text-white/50 text-center animate-pulse">
          Đang tải model...
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 text-red-300 rounded-lg px-3 py-2 text-xs text-center backdrop-blur-sm">
          {error}
        </div>
      )}
    </aside>
  )
}