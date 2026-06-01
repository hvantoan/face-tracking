import { describe, it, expect } from 'vitest'
import type { DetectedFace } from '../face'
import { PickerStateEnum } from '../face'

describe('DetectedFace type contract', () => {
  it('PickerStateEnum has all required states', () => {
    expect(PickerStateEnum.IDLE).toBe('idle')
    expect(PickerStateEnum.SPINNING).toBe('spinning')
    expect(PickerStateEnum.SELECTED).toBe('selected')
  })

  it('creates a valid DetectedFace', () => {
    const face: DetectedFace = {
      id: 0,
      label: 'Người 1',
      boundingBox: { x: 10, y: 20, width: 100, height: 120 },
      confidence: 0.95,
    }
    expect(face.id).toBe(0)
    expect(face.label).toBe('Người 1')
    expect(face.boundingBox.x).toBe(10)
  })
})