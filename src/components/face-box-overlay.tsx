import type { DetectedFace } from '@/types/face'

interface FaceBoxOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  faces: DetectedFace[]
  highlightedIndex: number | null
  selectedIndex: number | null
  videoWidth: number
  videoHeight: number
}

export function drawFaceBoxes({
  canvasRef,
  faces,
  highlightedIndex,
  selectedIndex,
  videoWidth,
  videoHeight,
}: FaceBoxOverlayProps) {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = videoWidth
  canvas.height = videoHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const face of faces) {
    const isSelected = selectedIndex === face.id
    const isHighlighted = highlightedIndex === face.id
    const isSpinningTarget = isHighlighted && !isSelected

    ctx.lineWidth = isSelected ? 4 : isSpinningTarget ? 3 : 2

    if (isSelected) {
      ctx.strokeStyle = '#ef4444'
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'
    } else if (isSpinningTarget) {
      ctx.strokeStyle = '#f97316'
      ctx.fillStyle = 'transparent'
    } else {
      ctx.strokeStyle = '#ef4444'
      ctx.fillStyle = 'transparent'
    }

    const { x, y, width, height } = face.boundingBox
    ctx.strokeRect(x, y, width, height)
    if (isSelected) {
      ctx.fillRect(x, y, width, height)
    }

    // Label
    ctx.font = '14px system-ui'
    ctx.fillStyle = isSelected ? '#fff' : '#fff'
    ctx.fillText(face.label, x + 4, y - 8)
  }
}