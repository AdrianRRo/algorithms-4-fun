import { StepColors } from './colors'

export interface CellPosition {
  row: number
  col: number
}

export interface GridCellState {
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
  current?: CellPosition
  path?: string[]
}

export interface PathfindingStep {
  grid: GridCellState[][]
  metadata?: PathfindingMetadata
}
