import { StepColors } from './colors'

export interface NodePosition {
  row: number
  col: number
}

export interface GridNode {
  id: string
  row: number
  col: number
  color: StepColors
  isStart?: boolean
  isGoal?: boolean
  isWall?: boolean
}

export interface PathfindingMetadata {
  description?: string
  openSet?: string[]
  closedSet?: string[]
  current?: NodePosition
  path?: string[]
}

export interface PathfindingStep {
  grid: GridNode[][]
  metadata?: PathfindingMetadata
}
