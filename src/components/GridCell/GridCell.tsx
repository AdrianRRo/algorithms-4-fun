import React from 'react'
import { GridCellState } from '../../types/pathfinding'
import { StepColors } from '../../types/colors'
import './GridCell.css'

interface GridCellProps {
  cell: GridCellState
}

const GridCell: React.FC<GridCellProps> = ({ cell }) => {
  let label = ''

  if (cell.isStart) {
    label = 'S'
  } else if (cell.isGoal) {
    label = 'G'
  } else if (cell.color === StepColors.PATHFIND_PATH) {
    label = '•'
  }

  const textColor = cell.isStart || cell.isGoal ? '#f8fafc' : '#1f2937'

  return (
    <div
      className="grid-cell"
      style={{ backgroundColor: cell.color, color: textColor }}
      title={`Cell ${cell.row}, ${cell.col}`}
      aria-label={`Cell ${cell.id}`}
    >
      {label}
    </div>
  )
}

export default GridCell
