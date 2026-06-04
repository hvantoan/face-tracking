import { useState, useEffect, useCallback, useRef } from 'react'
import type { CapturedFace } from '@/types/face'
import { cn } from '@/lib/utils'

interface CelebrationOverlayProps {
  capturedFace: CapturedFace | null
  onDismiss: () => void
}

type Phase = 'enter' | 'visible' | 'exit'

/** Outer: conditional render — unmounts when capturedFace is null */
export function CelebrationOverlay({ capturedFace, onDismiss }: CelebrationOverlayProps) {
  if (!capturedFace) return null
  return <CelebrationOverlayInner capturedFace={capturedFace} onDismiss={onDismiss} />
}

/** Inner: always has valid capturedFace, manages own visibility lifecycle */
function CelebrationOverlayInner({ capturedFace, onDismiss }: { capturedFace: CapturedFace; onDismiss: () => void }) {
  const [phase, setPhase] = useState<Phase>('enter')
  const [visible, setVisible] = useState(true)
  const dismissed = useRef(false)

  const dismiss = useCallback(() => {
    if (dismissed.current) return
    dismissed.current = true
    setPhase('exit')
    setTimeout(() => {
      setVisible(false)
      onDismiss()
    }, 300)
  }, [onDismiss])

  // Enter → visible animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('visible'))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Auto-dismiss after 3s
  useEffect(() => {
    const timer = setTimeout(dismiss, 3000)
    return () => clearTimeout(timer)
  }, [dismiss])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={dismiss}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-4 transition-all duration-300',
          phase === 'enter' && 'opacity-0 scale-95',
          phase === 'visible' && 'opacity-100 scale-100',
          phase === 'exit' && 'opacity-0 scale-95',
        )}
      >
        <img
          src={capturedFace.dataUrl}
          alt={capturedFace.label}
          className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl border-4 border-primary"
        />
        <p className="text-2xl font-bold text-white drop-shadow-lg">
          {capturedFace.label}
        </p>
        <p className="text-sm text-white/70">Đã chọn!</p>
      </div>
    </div>
  )
}