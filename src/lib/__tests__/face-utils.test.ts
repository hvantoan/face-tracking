import { describe, it, expect } from 'vitest'
import { formatFaceLabel } from '@/lib/face-utils'

describe('formatFaceLabel', () => {
  it('returns "Người 1" for index 0', () => {
    expect(formatFaceLabel(0)).toBe('Người 1')
  })
  it('returns "Người 3" for index 2', () => {
    expect(formatFaceLabel(2)).toBe('Người 3')
  })
})