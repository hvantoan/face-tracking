import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRandomPicker } from '../use-random-picker'

describe('useRandomPicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes in IDLE state with no selection', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    expect(result.current.pickerState).toBe('idle')
    expect(result.current.selectedIndex).toBeNull()
    expect(result.current.highlightedIndex).toBeNull()
  })

  it('triggerPick transitions to SPINNING state', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    act(() => { result.current.triggerPick() })
    expect(result.current.pickerState).toBe('spinning')
  })

  it('highlightedIndex cycles during spinning', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    act(() => { result.current.triggerPick() })
    // Advance past first tick (50ms) so highlightedIndex is set
    act(() => { vi.advanceTimersByTime(60) })
    const idx = result.current.highlightedIndex
    expect(idx).not.toBeNull()
    expect(idx!).toBeGreaterThanOrEqual(0)
    expect(idx!).toBeLessThan(3)
  })

  it('ends in SELECTED state after spin duration', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    act(() => { result.current.triggerPick() })
    // Advance past spin duration (~2.5s)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.pickerState).toBe('selected')
    expect(result.current.selectedIndex).not.toBeNull()
    expect(result.current.selectedIndex!).toBeGreaterThanOrEqual(0)
    expect(result.current.selectedIndex!).toBeLessThan(3)
  })

  it('reset returns to IDLE state', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    act(() => { result.current.triggerPick() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.pickerState).toBe('selected')
    act(() => { result.current.reset() })
    expect(result.current.pickerState).toBe('idle')
    expect(result.current.selectedIndex).toBeNull()
  })

  it('triggerPick during SELECTED resets and starts new spin', () => {
    const { result } = renderHook(() => useRandomPicker(3))
    act(() => { result.current.triggerPick() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.pickerState).toBe('selected')
    // Second pick should reset and start new spin
    act(() => { result.current.triggerPick() })
    expect(result.current.pickerState).toBe('spinning')
  })

  it('handles faceCount = 0 gracefully (no crash)', () => {
    const { result } = renderHook(() => useRandomPicker(0))
    act(() => { result.current.triggerPick() })
    expect(['idle', 'spinning', 'selected']).toContain(result.current.pickerState)
  })
})