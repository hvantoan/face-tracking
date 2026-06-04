import { useRef, useEffect, useState, useCallback } from 'react'
import type { DetectedFace, PickerState, CapturedFace } from '@/types/face'
import type { RefObject } from 'react'

const PADDING_RATIO = 0.2
const OUTPUT_SIZE = 300

function captureFromVideo(
  video: HTMLVideoElement,
  face: DetectedFace,
): CapturedFace | null {
  if (video.readyState < 2) return null

  const { boundingBox } = face
  const padW = boundingBox.width * PADDING_RATIO
  const padH = boundingBox.height * PADDING_RATIO
  const sx = Math.max(0, Math.floor(boundingBox.x - padW))
  const sy = Math.max(0, Math.floor(boundingBox.y - padH))
  const sw = Math.min(video.videoWidth - sx, Math.floor(boundingBox.width + 2 * padW))
  const sh = Math.min(video.videoHeight - sy, Math.floor(boundingBox.height + 2 * padH))

  const scale = OUTPUT_SIZE / Math.max(sw, sh)
  const dw = Math.round(sw * scale)
  const dh = Math.round(sh * scale)

  const canvas = document.createElement('canvas')
  canvas.width = dw
  canvas.height = dh
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, dw, dh)
  return { dataUrl: canvas.toDataURL('image/png'), label: face.label }
}

export function useFaceCapture(
  videoRef: RefObject<HTMLVideoElement | null>,
  selectedFace: DetectedFace | null,
  pickerState: PickerState,
): CapturedFace | null {
  const [capturedFace, setCapturedFace] = useState<CapturedFace | null>(null)
  const prevPickerState = useRef<PickerState>(pickerState)

  const doCapture = useCallback(() => {
    if (!selectedFace) return
    const video = videoRef.current
    if (!video) return
    const result = captureFromVideo(video, selectedFace)
    if (result) setCapturedFace(result)
  }, [selectedFace, videoRef])

  useEffect(() => {
    if (pickerState === 'selected' && prevPickerState.current !== 'selected') {
      doCapture()
    }
    prevPickerState.current = pickerState
  }, [pickerState, doCapture])

  // Derive: only expose capture while in 'selected' state
  return pickerState === 'selected' ? capturedFace : null
}