import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { PickerState } from '@/types/face'

export function useCelebration(pickerState: PickerState): void {
  const prevPickerState = useRef<PickerState>(pickerState)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (
      pickerState === 'selected' &&
      prevPickerState.current !== 'selected'
    ) {
      // Stop previous audio if still playing (rapid re-picks)
      audioRef.current?.pause()

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
      })

      const audio = new Audio('/assets/celebration.mp3')
      audio.volume = 0.7
      audio.play().catch(() => { /* autoplay blocked — silent fallback */ })
      audioRef.current = audio
    }

    prevPickerState.current = pickerState
  }, [pickerState])
}