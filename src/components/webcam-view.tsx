import { useRef, useEffect } from 'react'
import type { DetectedFace } from '@/types/face'
import { drawFaceBoxes } from './face-box-overlay'
import { cn } from '@/lib/utils'

interface WebcamViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  faces: DetectedFace[]
  highlightedIndex: number | null
  selectedIndex: number | null
  className?: string
}

export function WebcamView({ videoRef, faces, highlightedIndex, selectedIndex, className }: WebcamViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    drawFaceBoxes({
      canvasRef,
      faces,
      highlightedIndex,
      selectedIndex,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    })
  }, [faces, highlightedIndex, selectedIndex, videoRef])

  return (
    <div className={cn('relative w-full aspect-video bg-black overflow-hidden rounded-lg', className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas className="absolute inset-0 w-full h-full pointer-events-none" ref={canvasRef} />
    </div>
  )
}