import type { Config } from '@vladmandic/human'

// Face-only detection config — disables all non-face models for performance.
// IMPORTANT: Valid property names are face.detector, face.mesh, face.iris.
// face.landmark does NOT exist in the Human API — use face.mesh instead.
export const humanConfig: Partial<Config> = {
  modelBasePath: '/models/',
  cacheModels: true,
  backend: 'webgl',
  debug: false,
  async: true,
  face: {
    enabled: true,
    detector: {
      enabled: true,
      modelPath: 'blazeface.json',
      maxDetected: 8,
      minConfidence: 0.5,
      skipFrames: 5,
      skipTime: 200,
    },
    mesh: { enabled: true },       // NOT face.landmark — use face.mesh
    iris: { enabled: false },
    description: { enabled: false },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
    attention: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
}