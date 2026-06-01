import { useRef, useState, useCallback, useEffect } from 'react'
import { Human } from '@vladmandic/human'
import { humanConfig } from '@/lib/human-config'
import { formatFaceLabel } from '@/lib/face-utils'
import type { DetectedFace } from '@/types/face'

export interface UseFaceDetectionReturn {
  faces: DetectedFace[]
  isLoading: boolean
  error: string | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  startDetection: () => Promise<void>
  stopDetection: () => void
}

function mapFaceResult(rawFaces: Array<{ box: number[]; boxRaw: number[]; boxScore: number; faceScore: number; score?: number }>): DetectedFace[] {
  return rawFaces.map((face, index) => ({
    id: index,
    label: formatFaceLabel(index),
    boundingBox: {
      x: face.box?.[0] ?? 0,
      y: face.box?.[1] ?? 0,
      width: face.box?.[2] ?? 0,
      height: face.box?.[3] ?? 0,
    },
    confidence: face.boxScore ?? face.faceScore ?? face.score ?? 0,
  }))
}

// Module-level singleton survives React StrictMode double-mount
let humanInstance: Human | null = null
function getHuman(): Human {
  if (!humanInstance) {
    humanInstance = new Human(humanConfig)
  }
  return humanInstance
}

export function useFaceDetection(): UseFaceDetectionReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number>(0)
  const [faces, setFaces] = useState<DetectedFace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isRunning = useRef(false)
  const initAbortRef = useRef<AbortController | null>(null)
  const detectLoopRef = useRef<(() => void) | null>(null)

  // Assign detectLoop to ref inside effect to avoid render-time ref assignment
  useEffect(() => {
    detectLoopRef.current = async () => {
      if (!isRunning.current || !videoRef.current) return
      const human = getHuman()

      try {
        const result = await human.detect(videoRef.current)
        const mapped = mapFaceResult(result.face as Array<{ box: number[]; boxRaw: number[]; boxScore: number; faceScore: number; score?: number }>)
        setFaces(mapped)
      } catch {
        // Continue loop on detection error
      }

      if (isRunning.current) {
        rafRef.current = requestAnimationFrame(() => { detectLoopRef.current?.() })
      }
    }
  }, [])

  const startDetection = useCallback(async () => {
    if (isRunning.current) return

    // Abort any previous in-flight init (StrictMode double-mount)
    initAbortRef.current?.abort()
    const abortController = new AbortController()
    initAbortRef.current = abortController

    setIsLoading(true)
    setError(null)
    isRunning.current = true

    try {
      const human = getHuman()
      await human.load()
      await human.warmup()

      // Check if aborted during async init
      if (abortController.signal.aborted) return

      if (videoRef.current) {
        await human.webcam.start({ element: videoRef.current })
      }

      if (!abortController.signal.aborted) {
        detectLoopRef.current?.()
      }
    } catch (err) {
      if (abortController.signal.aborted) return
      let msg = 'Không thể khởi động camera'
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') msg = 'Quyền truy cập camera bị từ chối'
        else if (err.name === 'NotFoundError') msg = 'Không tìm thấy thiết bị camera'
      } else if (err instanceof Error) {
        msg = err.message
      }
      setError(msg)
      isRunning.current = false
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  const stopDetection = useCallback(() => {
    isRunning.current = false
    initAbortRef.current?.abort()
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    const human = getHuman()
    human.webcam.stop()
    setFaces([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunning.current = false
      initAbortRef.current?.abort()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const human = getHuman()
      human.webcam.stop()
      // Note: do NOT call human.destroy() — module singleton lives across mounts
    }
  }, [])

  return { faces, isLoading, error, videoRef, startDetection, stopDetection }
}