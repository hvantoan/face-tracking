import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FaceCounter } from '../face-counter'

describe('FaceCounter', () => {
  it('renders count 0 with label', () => {
    render(<FaceCounter count={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('người phát hiện')).toBeInTheDocument()
  })

  it('renders count 3 with label', () => {
    render(<FaceCounter count={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders count 1 for singular', () => {
    render(<FaceCounter count={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})