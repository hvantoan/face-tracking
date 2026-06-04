import { useEffect, useRef, useState } from 'react'
import { useFaceDetection } from '@/hooks/use-face-detection'
import { useRandomPicker } from '@/hooks/use-random-picker'
import { useFaceCapture } from '@/hooks/use-face-capture'
import { useCelebration } from '@/hooks/use-celebration'
import { WebcamView } from '@/components/webcam-view'
import { AppSidebar } from '@/components/app-sidebar'
import { MobilePortraitOverlay, MobileLandscapeOverlay } from '@/components/mobile-overlay'
import { CelebrationOverlay } from '@/components/celebration-overlay'

export default function App() {
  const { faces, isLoading, error, videoRef, startDetection, stopDetection } = useFaceDetection()
  const { pickerState, selectedIndex, highlightedIndex, triggerPick, reset } = useRandomPicker(faces.length)

  // Celebration hooks
  const selectedFace = selectedIndex !== null ? faces[selectedIndex] ?? null : null
  const capturedFace = useFaceCapture(videoRef, selectedFace, pickerState)
  useCelebration(pickerState)

  // Increment pick counter on each new selection — forces overlay remount
  const [pickCount, setPickCount] = useState(0)
  const [prevPicker, setPrevPicker] = useState(pickerState)
  if (prevPicker !== pickerState) {
    setPrevPicker(pickerState)
    if (pickerState === 'selected') setPickCount(c => c + 1)
  }

  // Auto-start webcam on mount
  useEffect(() => {
    startDetection()
    return () => { stopDetection() }
  }, [startDetection, stopDetection])

  // Debounced reset: only reset picker when face count stabilizes
  const prevFaceCountRef = useRef(faces.length)
  useEffect(() => {
    if (pickerState === 'selected' && faces.length !== prevFaceCountRef.current) {
      const timer = setTimeout(() => { reset() }, 500)
      prevFaceCountRef.current = faces.length
      return () => { clearTimeout(timer) }
    }
    prevFaceCountRef.current = faces.length
  }, [faces.length, pickerState, reset])

  const pickerDisabled = faces.length === 0 && pickerState === 'idle'

  return (
    <div className="min-h-dvh bg-black overflow-hidden lg:flex">
      {/* Camera area — full screen on mobile, flex-1 on desktop */}
      <main className="relative min-h-dvh lg:min-h-0 lg:flex-1 lg:flex lg:items-center lg:justify-center lg:p-4">
        <WebcamView
          videoRef={videoRef}
          faces={faces}
          highlightedIndex={highlightedIndex}
          selectedIndex={selectedIndex}
          className="absolute inset-0 rounded-none lg:relative lg:aspect-video lg:max-h-[calc(100dvh-2rem)] lg:rounded-xl"
        />

        {/* Mobile portrait overlay */}
        <MobilePortraitOverlay
          pickerState={pickerState}
          faceCount={faces.length}
          onPick={triggerPick}
          disabled={pickerDisabled}
          isLoading={isLoading}
          error={error}
        />

        {/* Mobile landscape overlay */}
        <MobileLandscapeOverlay
          pickerState={pickerState}
          faceCount={faces.length}
          onPick={triggerPick}
          disabled={pickerDisabled}
          isLoading={isLoading}
          error={error}
        />
      </main>

      {/* Desktop glass sidebar (≥1024px) */}
      <AppSidebar
        pickerState={pickerState}
        faceCount={faces.length}
        selectedIndex={selectedIndex}
        highlightedIndex={highlightedIndex}
        faces={faces}
        onPick={triggerPick}
        disabled={pickerDisabled}
        isLoading={isLoading}
        error={error}
      />

      {/* Celebration overlay — works on all screen sizes */}
      <CelebrationOverlay
        key={pickCount}
        capturedFace={capturedFace}
        onDismiss={() => {}}
      />
    </div>
  )
}