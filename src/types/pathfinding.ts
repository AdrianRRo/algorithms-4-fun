import { StepColors } from './colors'

export interface CellPosition {
  row: number
  col: number
}

export interface GridCell {
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
  openCells?: string[]
  closedCells?: string[]
  current?: CellPosition
  pathCells?: string[]
}

export type CellState =
  | 'empty'
  | 'wall'
  | 'start'
  | 'goal'
  | 'open'
  | 'closed'
  | 'path'
  | 'current'

export interface PathfindingStep {
  grid: GridCell[][]
  metadata?: PathfindingMetadata
}
