import { describe, it, expect } from 'vitest'
import { humanConfig } from '../human-config'

describe('humanConfig', () => {
  it('disables all non-face models', () => {
    expect(humanConfig.body).toBeDefined()
    expect(humanConfig.body!.enabled).toBe(false)
    expect(humanConfig.hand).toBeDefined()
    expect(humanConfig.hand!.enabled).toBe(false)
    expect(humanConfig.object).toBeDefined()
    expect(humanConfig.object!.enabled).toBe(false)
    expect(humanConfig.gesture).toBeDefined()
    expect(humanConfig.gesture!.enabled).toBe(false)
  })

  it('enables face detector and mesh (NOT landmark)', () => {
    const face = humanConfig.face!
    expect(face.enabled).toBe(true)
    expect(face.detector).toBeDefined()
    expect(face.detector!.enabled).toBe(true)
    expect(face.mesh).toBeDefined()
    expect(face.mesh!.enabled).toBe(true)
  })

  it('sets webgl backend and performance opts', () => {
    expect(humanConfig.backend).toBe('webgl')
    expect(humanConfig.debug).toBe(false)
    expect(humanConfig.async).toBe(true)
  })

  it('sets maxDetected on face detector', () => {
    expect(humanConfig.face!.detector!.maxDetected).toBe(8)
  })

  it('disables face description, emotion, antispoof, liveness, attention', () => {
    const face = humanConfig.face!
    expect(face.description!.enabled).toBe(false)
    expect(face.emotion!.enabled).toBe(false)
    expect(face.antispoof!.enabled).toBe(false)
    expect(face.liveness!.enabled).toBe(false)
    expect(face.attention!.enabled).toBe(false)
  })

  it('sets modelBasePath to /models/', () => {
    expect(humanConfig.modelBasePath).toBe('/models/')
  })

  it('enables model caching', () => {
    expect(humanConfig.cacheModels).toBe(true)
  })
})