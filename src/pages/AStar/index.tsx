import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AStar, GridCell } from '../../algorithms/AStar'
import './AStar.css'

const GRID_WIDTH = 20
const GRID_HEIGHT = 15
const CELL_SIZE = 40

type SearchStatus = 'idle' | 'success' | 'failure'

type HeuristicType = 'manhattan' | 'euclidean' | 'diagonal'

const AStarVisualization: React.FC = () => {
  const [gridMatrix, setGridMatrix] = useState<number[][]>([])
  const [startCell, setStartCell] = useState<[number, number]>([0, 0])
  const [goalCell, setGoalCell] = useState<[number, number]>([
    GRID_WIDTH - 1,
    GRID_HEIGHT - 1,
  ])
  const [pathCells, setPathCells] = useState<GridCell[]>([])
  const [visitedCells, setVisitedCells] = useState<GridCell[]>([])
  const [openCells, setOpenCells] = useState<GridCell[]>([])
  const [closedCells, setClosedCells] = useState<GridCell[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [heuristic, setHeuristic] = useState<HeuristicType>('manhattan')
  const [allowDiagonal, setAllowDiagonal] = useState(true)
  const [status, setStatus] = useState<SearchStatus>('idle')

  const runningRef = useRef(false)
  const hasInitialized = useRef(false)

  const resetVisualizationState = useCallback(() => {
    runningRef.current = false
    setIsRunning(false)
    setStatus('idle')
    setPathCells([])
    setVisitedCells([])
    setOpenCells([])
    setClosedCells([])
  }, [])

  const initializeGrid = useCallback(() => {
    resetVisualizationState()

    const newGrid = AStar.generateRandomGrid(GRID_WIDTH, GRID_HEIGHT, 0.25)
    const [startCol, startRow] = startCell
    const [goalCol, goalRow] = goalCell
    newGrid[startRow][startCol] = 0
    newGrid[goalRow][goalCol] = 0

    setGridMatrix(newGrid)
  }, [goalCell, resetVisualizationState, startCell])

  useEffect(() => {
    if (!hasInitialized.current) {
      initializeGrid()
      hasInitialized.current = true
    }
  }, [initializeGrid])

  const handleCellToggle = (col: number, row: number) => {
    if (isRunning || gridMatrix.length === 0) {
      return
    }

    setGridMatrix((previous) => {
      if (previous.length === 0) {
        return previous
      }

      const updated = previous.map((gridRow) => [...gridRow])

      if (
        (col === startCell[0] && row === startCell[1]) ||
        (col === goalCell[0] && row === goalCell[1])
      ) {
        return updated
      }

      updated[row][col] = updated[row][col] === 0 ? 1 : 0
      return updated
    })

    resetVisualizationState()
  }

  const handleSetStart = (col: number, row: number) => {
    if (isRunning || gridMatrix.length === 0 || (col === goalCell[0] && row === goalCell[1])) {
      return
    }

    const [previousCol, previousRow] = startCell
    setStartCell([col, row])

    setGridMatrix((previous) => {
      if (previous.length === 0) {
        return previous
      }
      const updated = previous.map((gridRow) => [...gridRow])
      updated[row][col] = 0
      if (updated[previousRow] && typeof updated[previousRow][previousCol] !== 'undefined') {
        updated[previousRow][previousCol] = 0
      }
      return updated
    })

    resetVisualizationState()
  }

  const handleSetGoal = (col: number, row: number) => {
    if (isRunning || gridMatrix.length === 0 || (col === startCell[0] && row === startCell[1])) {
      return
    }

    const [previousCol, previousRow] = goalCell
    setGoalCell([col, row])

    setGridMatrix((previous) => {
      if (previous.length === 0) {
        return previous
      }
      const updated = previous.map((gridRow) => [...gridRow])
      updated[row][col] = 0
      if (updated[previousRow] && typeof updated[previousRow][previousCol] !== 'undefined') {
        updated[previousRow][previousCol] = 0
      }
      return updated
    })

    resetVisualizationState()
  }

  const handleStop = useCallback(() => {
    if (!runningRef.current) {
      return
    }
    runningRef.current = false
    setIsRunning(false)
    setStatus('idle')
  }, [])

  const runAlgorithm = useCallback(async () => {
    if (isRunning || gridMatrix.length === 0) {
      return
    }

    runningRef.current = true
    setIsRunning(true)
    setStatus('idle')
    setPathCells([])
    setVisitedCells([])
    setOpenCells([])
    setClosedCells([])

    const astar = new AStar(gridMatrix, startCell, goalCell, heuristic, allowDiagonal)
    const result = astar.findPath()
    let cancelled = false

    for (let index = 0; index < result.visited.length; index += 1) {
      if (!runningRef.current) {
        cancelled = true
        break
      }
      setVisitedCells(result.visited.slice(0, index + 1))
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, speed))
    }

    if (!cancelled && result.success) {
      for (let index = 0; index < result.path.length; index += 1) {
        if (!runningRef.current) {
          cancelled = true
          break
        }
        setPathCells(result.path.slice(0, index + 1))
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, speed * 2))
      }
    }

    setOpenCells(result.openCells)
    setClosedCells(result.closedCells)

    if (cancelled) {
      runningRef.current = false
      setIsRunning(false)
      setStatus('idle')
      return
    }

    if (!result.success) {
      setPathCells([])
      setStatus('failure')
    } else {
      setStatus('success')
    }

    runningRef.current = false
    setIsRunning(false)
  }, [allowDiagonal, goalCell, gridMatrix, heuristic, isRunning, speed, startCell])

  const isCellInList = useCallback((cells: GridCell[], col: number, row: number) => {
    return cells.some((cell) => cell.col === col && cell.row === row)
  }, [])

  const getCellColor = (col: number, row: number): string => {
    if (col === startCell[0] && row === startCell[1]) {
      return '#4CAF50'
    }

    if (col === goalCell[0] && row === goalCell[1]) {
      return '#F44336'
    }

    if (gridMatrix[row] && gridMatrix[row][col] === 1) {
      return '#333333'
    }

    if (isCellInList(pathCells, col, row)) {
      return '#2196F3'
    }

    if (isCellInList(visitedCells, col, row)) {
      return '#FF9800'
    }

    if (isCellInList(openCells, col, row)) {
      return '#9C27B0'
    }

    if (isCellInList(closedCells, col, row)) {
      return '#8D6E63'
    }

    return '#FFFFFF'
  }

  const statusText = isRunning
    ? 'Running'
    : status === 'success'
    ? 'Path found!'
    : status === 'failure'
    ? 'No path found.'
    : 'Ready'

  return (
    <div className="astar-container">
      <h1>A* Pathfinding Algorithm</h1>

      <div className="controls">
        <button onClick={initializeGrid} disabled={isRunning} className="control-button">
          Generate New Grid
        </button>

        <button
          onClick={runAlgorithm}
          disabled={isRunning || gridMatrix.length === 0}
          className="control-button primary"
        >
          {isRunning ? 'Running...' : 'Find Path'}
        </button>

        <button onClick={handleStop} disabled={!isRunning} className="control-button secondary">
          Stop
        </button>

        <div className="control-group">
          <label>
            Speed:
            <input
              type="range"
              min={10}
              max={200}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              disabled={isRunning}
            />
            {`${speed}ms`}
          </label>
        </div>

        <div className="control-group">
          <label>
            Heuristic:
            <select
              value={heuristic}
              onChange={(event) => setHeuristic(event.target.value as HeuristicType)}
              disabled={isRunning}
            >
              <option value="manhattan">Manhattan</option>
              <option value="euclidean">Euclidean</option>
              <option value="diagonal">Diagonal</option>
            </select>
          </label>
        </div>

        <div className="control-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={allowDiagonal}
              onChange={(event) => setAllowDiagonal(event.target.checked)}
              disabled={isRunning}
            />
            Allow diagonal movement
          </label>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4CAF50' }} />
          <span>Start Cell</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#F44336' }} />
          <span>Goal Cell</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2196F3' }} />
          <span>Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF9800' }} />
          <span>Visited Cells</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#9C27B0' }} />
          <span>Open Cells</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8D6E63' }} />
          <span>Closed Cells</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#333333' }} />
          <span>Obstacle</span>
        </div>
      </div>

      <div className="grid-container">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
          }}
        >
          {gridMatrix.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <div
                key={`${colIndex}-${rowIndex}`}
                className="grid-cell"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: getCellColor(colIndex, rowIndex),
                  border: '1px solid #ddd',
                }}
                onClick={() => handleCellToggle(colIndex, rowIndex)}
                onContextMenu={(event) => {
                  event.preventDefault()
                  handleSetStart(colIndex, rowIndex)
                }}
                onDoubleClick={() => handleSetGoal(colIndex, rowIndex)}
                title={'Click: Toggle obstacle
Right-click: Set start
Double-click: Set goal'}
              >
                {colIndex === startCell[0] && rowIndex === startCell[1] && 'S'}
                {colIndex === goalCell[0] && rowIndex === goalCell[1] && 'E'}
              </div>
            )),
          )}
        </div>
      </div>

      <div className="stats">
        <p>Path length: {pathCells.length} cells</p>
        <p>Cells visited: {visitedCells.length}</p>
        <p>Open set size: {openCells.length}</p>
        <p>Closed set size: {closedCells.length}</p>
        <p>Status: {statusText}</p>
      </div>

      <div className="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Click on a cell to toggle obstacles.</li>
          <li>Right-click to set the start cell.</li>
          <li>Double-click to set the goal cell.</li>
          <li>Adjust the speed, heuristic, and diagonal movement.</li>
          <li>Press "Find Path" to run the algorithm.</li>
        </ul>
      </div>
    </div>
  )
}

export default AStarVisualization
