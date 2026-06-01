export interface FaceBoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface DetectedFace {
  id: number
  label: string
  boundingBox: FaceBoundingBox
  confidence: number
}

export const PickerStateEnum = {
  IDLE: 'idle',
  SPINNING: 'spinning',
  SELECTED: 'selected',
} as const

export type PickerState = (typeof PickerStateEnum)[keyof typeof PickerStateEnum]