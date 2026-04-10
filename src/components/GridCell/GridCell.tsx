import React from 'react'
import { GridNode } from '../../types/pathfinding'
import { StepColors } from '../../types/colors'
import './GridCell.css'

interface GridCellProps {
  node: GridNode
}

const GridCell: React.FC<GridCellProps> = ({ node }) => {
  let label = ''

  if (node.isStart) {
    label = 'S'
  } else if (node.isGoal) {
    label = 'G'
  } else if (node.color === StepColors.PATHFIND_PATH) {
    label = '•'
  }

  const textColor = node.isStart || node.isGoal ? '#f8fafc' : '#1f2937'

  return (
    <div
      className="grid-cell"
      style={{ backgroundColor: node.color, color: textColor }}
      title={`Celda ${node.row}, ${node.col}`}
      aria-label={`Celda ${node.id}`}
    >
      {label}
    </div>
  )
}

export default GridCell
