import { useRef, useState, useCallback, useEffect } from 'react'
import { PickerStateEnum } from '@/types/face'
import type { PickerState } from '@/types/face'

const SPIN_DURATION_MS = 2500
const INITIAL_INTERVAL_MS = 50
const DECELERATION_FACTOR = 1.15 // Each tick interval increases by this factor

export interface UseRandomPickerReturn {
  pickerState: PickerState
  selectedIndex: number | null
  highlightedIndex: number | null
  triggerPick: () => void
  reset: () => void
}

export function useRandomPicker(faceCount: number): UseRandomPickerReturn {
  const [pickerState, setPickerState] = useState<PickerState>(PickerStateEnum.IDLE)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSpinTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const runSpin = useCallback((count: number) => {
    if (count === 0) {
      setPickerState(PickerStateEnum.IDLE)
      return
    }

    setPickerState(PickerStateEnum.SPINNING)
    setSelectedIndex(null)

    const targetIndex = Math.floor(Math.random() * count)
    let currentInterval = INITIAL_INTERVAL_MS
    let elapsed = 0
    let currentIndex = Math.floor(Math.random() * count)

    const tick = () => {
      currentIndex = (currentIndex + 1) % count
      setHighlightedIndex(currentIndex)
      elapsed += currentInterval

      if (elapsed >= SPIN_DURATION_MS) {
        // Final: land on target
        setHighlightedIndex(targetIndex)
        setSelectedIndex(targetIndex)
        setPickerState(PickerStateEnum.SELECTED)
        timerRef.current = null
        return
      }

      currentInterval *= DECELERATION_FACTOR
      timerRef.current = setTimeout(tick, currentInterval)
    }

    timerRef.current = setTimeout(tick, currentInterval)
  }, [])

  const triggerPick = useCallback(() => {
    clearSpinTimer()
    runSpin(faceCount)
  }, [faceCount, clearSpinTimer, runSpin])

  const reset = useCallback(() => {
    clearSpinTimer()
    setPickerState(PickerStateEnum.IDLE)
    setSelectedIndex(null)
    setHighlightedIndex(null)
  }, [clearSpinTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => { clearSpinTimer() }
  }, [clearSpinTimer])

  return { pickerState, selectedIndex, highlightedIndex, triggerPick, reset }
}