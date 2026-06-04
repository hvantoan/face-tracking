import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RandomPickerButton } from '../random-picker-button'

describe('RandomPickerButton', () => {
  it('renders "CHỌN" text in idle state', () => {
    render(<RandomPickerButton state="idle" onPick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /chọn/i })).toBeInTheDocument()
  })

  it('renders spinning indicator in spinning state', () => {
    render(<RandomPickerButton state="spinning" onPick={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders "CHỌN LẠI" text in selected state', () => {
    render(<RandomPickerButton state="selected" onPick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /chọn lại/i })).toBeInTheDocument()
  })

  it('calls onPick when clicked in idle state', () => {
    const onPick = vi.fn()
    render(<RandomPickerButton state="idle" onPick={onPick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPick).toHaveBeenCalledOnce()
  })

  it('calls onPick when clicked in selected state', () => {
    const onPick = vi.fn()
    render(<RandomPickerButton state="selected" onPick={onPick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<RandomPickerButton state="idle" onPick={vi.fn()} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})