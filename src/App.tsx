import { useEffect, useRef, useState } from 'react'
import { useFaceDetection } from '@/hooks/use-face-detection'
import { useRandomPicker } from '@/hooks/use-random-picker'
import { useFaceCapture } from '@/hooks/use-face-capture'
import { useCelebration } from '@/hooks/use-celebration'
import { WebcamView } from '@/components/webcam-view'
import { AppSidebar } from '@/components/app-sidebar'
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

  return (
    <div className="min-h-svh flex flex-col-reverse md:flex-row bg-background text-foreground">
      {/* Sidebar: controls on bottom (mobile) / left (desktop) */}
      <AppSidebar
        pickerState={pickerState}
        faceCount={faces.length}
        selectedIndex={selectedIndex}
        highlightedIndex={highlightedIndex}
        faces={faces}
        onPick={triggerPick}
        disabled={faces.length === 0 && pickerState === 'idle'}
        isLoading={isLoading}
        error={error}
      />

      {/* Main: video feed */}
      <main className="flex-1 flex items-center justify-center bg-black min-h-[50vh] md:min-h-svh p-2 md:p-4">
        <WebcamView
          videoRef={videoRef}
          faces={faces}
          highlightedIndex={highlightedIndex}
          selectedIndex={selectedIndex}
          className="md:rounded-xl max-h-[calc(100svh-2rem)]"
        />
        <CelebrationOverlay
          key={pickCount}
          capturedFace={capturedFace}
          onDismiss={() => {}}
        />
      </main>
    </div>
  )
}