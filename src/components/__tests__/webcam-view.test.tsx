import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { WebcamView } from '../webcam-view'

describe('WebcamView', () => {
  it('renders video element', () => {
    const videoRef = { current: null }
    const { container } = render(
      <WebcamView videoRef={videoRef} faces={[]} highlightedIndex={null} selectedIndex={null} />
    )
    expect(container.querySelector('video')).toBeInTheDocument()
  })

  it('renders canvas overlay element', () => {
    const videoRef = { current: null }
    const { container } = render(
      <WebcamView videoRef={videoRef} faces={[]} highlightedIndex={null} selectedIndex={null} />
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})