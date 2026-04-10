import React, { useCallback, useMemo } from 'react'
import Controls from '../../components/Controls/Controls'
import GridCell from '../../components/GridCell/GridCell'
import { usePathfinding } from '../../hooks/usePathfinding'
import { aStar, createAStarGrid } from '../../algorithms/AStar'
import { NodePosition, PathfindingStep } from '../../types/pathfinding'
import { StepColors } from '../../types/colors'
import './AStar.css'

const GRID_ROWS = 10
const GRID_COLS = 14
const START: NodePosition = { row: 1, col: 1 }
const GOAL: NodePosition = { row: 8, col: 12 }

const WALLS: NodePosition[] = (() => {
  const positions: NodePosition[] = []

  for (let row = 1; row < GRID_ROWS - 1; row += 1) {
    if (row === 4) {
      continue
    }
    positions.push({ row, col: 4 })
  }

  for (let col = 5; col < GRID_COLS - 2; col += 1) {
    if (col === 8) {
      continue
    }
    positions.push({ row: 6, col })
  }

  positions.push({ row: 2, col: 10 })
  positions.push({ row: 3, col: 10 })
  positions.push({ row: 7, col: 2 })
  positions.push({ row: 7, col: 3 })

  return positions
})()

const LEGEND = [
  { label: 'Inicio', color: StepColors.PATHFIND_START },
  { label: 'Meta', color: StepColors.PATHFIND_GOAL },
  { label: 'Pared', color: StepColors.PATHFIND_WALL },
  { label: 'Frontera abierta', color: StepColors.PATHFIND_OPEN },
  { label: 'Visitados', color: StepColors.PATHFIND_CLOSED },
  { label: 'Nodo actual', color: StepColors.PATHFIND_CURRENT },
  { label: 'Camino óptimo', color: StepColors.PATHFIND_PATH },
]

const AStar: React.FC = () => {
  const initialStep = useMemo<PathfindingStep>(() => ({
    grid: createAStarGrid(GRID_ROWS, GRID_COLS, START, GOAL, WALLS),
    metadata: {
      description: 'Haz clic en "Buscar camino" para ejecutar A*.',
    },
  }), [])

  const algorithm = useCallback(
    () => aStar(createAStarGrid(GRID_ROWS, GRID_COLS, START, GOAL, WALLS), START, GOAL),
    [],
  )

  const { steps, currentStep, handleFindPath } = usePathfinding(initialStep, algorithm, 400)
  const activeStep = steps[currentStep] ?? initialStep
  const description = activeStep.metadata?.description ?? ''
  const openCount = activeStep.metadata?.openSet?.length ?? 0
  const closedCount = activeStep.metadata?.closedSet?.length ?? 0

  return (
    <Controls
      onButtonClick={handleFindPath}
      text={'A* Pathfinding Visualization'}
      buttonLabel="Buscar camino"
    >
      <div className="astar-container">
        <div className="grid-wrapper">
          {activeStep.grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid-row">
              {row.map((node) => (
                <GridCell key={node.id} node={node} />
              ))}
            </div>
          ))}
        </div>
        <div className="info-panel">
          <p className="description">{description}</p>
          <div className="counters">
            <span>Frontera abierta: {openCount}</span>
            <span>Visitados: {closedCount}</span>
          </div>
          <div className="legend">
            {LEGEND.map((item) => (
              <div key={item.label} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Controls>
  )
}

export default AStar
