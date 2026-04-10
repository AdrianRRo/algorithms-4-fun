import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AStar, GridCell } from '../../algorithms/AStar'
import './AStar.css'

const GRID_WIDTH = 20
const GRID_HEIGHT = 15
const CELL_SIZE = 40

const AStarVisualization: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([])
  const [start, setStart] = useState<[number, number]>([0, 0])
  const [end, setEnd] = useState<[number, number]>([GRID_WIDTH - 1, GRID_HEIGHT - 1])
  const [path, setPath] = useState<GridCell[]>([])
  const [visited, setVisited] = useState<GridCell[]>([])
  const [openSet, setOpenSet] = useState<GridCell[]>([])
  const [closedSet, setClosedSet] = useState<GridCell[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [heuristic, setHeuristic] = useState<'manhattan' | 'euclidean' | 'diagonal'>('manhattan')
  const [allowDiagonal, setAllowDiagonal] = useState(true)
  const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle')

  const runningRef = useRef(false)
  const hasInitialized = useRef(false)

  const initializeGrid = useCallback(() => {
    runningRef.current = false
    setIsRunning(false)
    setStatus('idle')

    const newGrid = AStar.generateRandomGrid(GRID_WIDTH, GRID_HEIGHT, 0.25)
    newGrid[start[1]][start[0]] = 0
    newGrid[end[1]][end[0]] = 0

    setGrid(newGrid)
    setPath([])
    setVisited([])
    setOpenSet([])
    setClosedSet([])
  }, [end, start])

  useEffect(() => {
    if (!hasInitialized.current) {
      initializeGrid()
      hasInitialized.current = true
    }
  }, [initializeGrid])

  const handleCellClick = (x: number, y: number) => {
    if (isRunning || grid.length === 0) {
      return
    }

    setGrid((prev) => {
      if (prev.length === 0) {
        return prev
      }
      const updated = prev.map((row) => [...row])

      if ((x === start[0] && y === start[1]) || (x === end[0] && y === end[1])) {
        return updated
      }

      updated[y][x] = updated[y][x] === 0 ? 1 : 0
      return updated
    })

    setPath([])
    setVisited([])
    setOpenSet([])
    setClosedSet([])
    setStatus('idle')
  }

  const handleSetStart = (x: number, y: number) => {
    if (isRunning || (x === end[0] && y === end[1]) || grid.length === 0) {
      return
    }

    const [prevStartX, prevStartY] = start
    setStart([x, y])

    setGrid((prev) => {
      if (prev.length === 0) {
        return prev
      }
      const updated = prev.map((row) => [...row])
      updated[y][x] = 0
      if (updated[prevStartY] && typeof updated[prevStartY][prevStartX] !== 'undefined') {
        updated[prevStartY][prevStartX] = 0
      }
      return updated
    })

    setPath([])
    setVisited([])
    setOpenSet([])
    setClosedSet([])
    setStatus('idle')
  }

  const handleSetEnd = (x: number, y: number) => {
    if (isRunning || (x === start[0] && y === start[1]) || grid.length === 0) {
      return
    }

    const [prevEndX, prevEndY] = end
    setEnd([x, y])

    setGrid((prev) => {
      if (prev.length === 0) {
        return prev
      }
      const updated = prev.map((row) => [...row])
      updated[y][x] = 0
      if (updated[prevEndY] && typeof updated[prevEndY][prevEndX] !== 'undefined') {
        updated[prevEndY][prevEndX] = 0
      }
      return updated
    })

    setPath([])
    setVisited([])
    setOpenSet([])
    setClosedSet([])
    setStatus('idle')
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
    if (isRunning || grid.length === 0) {
      return
    }

    runningRef.current = true
    setIsRunning(true)
    setStatus('idle')
    setPath([])
    setVisited([])
    setOpenSet([])
    setClosedSet([])

    const astar = new AStar(grid, start, end, heuristic, allowDiagonal)
    const result = astar.findPath()
    let cancelled = false

    for (let i = 0; i < result.visited.length; i += 1) {
      if (!runningRef.current) {
        cancelled = true
        break
      }
      setVisited(result.visited.slice(0, i + 1))
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, speed))
    }

    if (!cancelled && result.success) {
      for (let i = 0; i < result.path.length; i += 1) {
        if (!runningRef.current) {
          cancelled = true
          break
        }
        setPath(result.path.slice(0, i + 1))
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, speed * 2))
      }
    }

    setOpenSet(result.openSet)
    setClosedSet(result.closedSet)

    if (cancelled) {
      runningRef.current = false
      setIsRunning(false)
      setStatus('idle')
      return
    }

    if (!result.success) {
      setPath([])
      setStatus('failure')
    } else {
      setStatus('success')
    }

    runningRef.current = false
    setIsRunning(false)
  }, [allowDiagonal, end, grid, heuristic, isRunning, speed, start])

  const isCellInList = useCallback((cells: GridCell[], x: number, y: number) => {
    return cells.some((cell) => cell.x === x && cell.y === y)
  }, [])

  const getCellColor = (x: number, y: number): string => {
    if (x === start[0] && y === start[1]) {
      return '#4CAF50'
    }

    if (x === end[0] && y === end[1]) {
      return '#F44336'
    }

    if (grid[y] && grid[y][x] === 1) {
      return '#333333'
    }

    if (isCellInList(path, x, y)) {
      return '#2196F3'
    }

    if (isCellInList(visited, x, y)) {
      return '#FF9800'
    }

    if (isCellInList(openSet, x, y)) {
      return '#9C27B0'
    }

    if (isCellInList(closedSet, x, y)) {
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

        <button onClick={runAlgorithm} disabled={isRunning || grid.length === 0} className="control-button primary">
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
              onChange={(event) => setHeuristic(event.target.value as typeof heuristic)}
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
          <span>Start</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#F44336' }} />
          <span>End</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2196F3' }} />
          <span>Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF9800' }} />
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#9C27B0' }} />
          <span>Open set</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8D6E63' }} />
          <span>Closed set</span>
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
          {grid.map((row, y) =>
            row.map((_, x) => (
              <div
                key={`${x}-${y}`}
                className="grid-cell"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: getCellColor(x, y),
                  border: '1px solid #ddd',
                }}
                onClick={() => handleCellClick(x, y)}
                onContextMenu={(event) => {
                  event.preventDefault()
                  handleSetStart(x, y)
                }}
                onDoubleClick={() => handleSetEnd(x, y)}
                title={'Click: Toggle obstacle
Right-click: Set start
Double-click: Set end'}
              >
                {x === start[0] && y === start[1] && 'S'}
                {x === end[0] && y === end[1] && 'E'}
              </div>
            )),
          )}
        </div>
      </div>

      <div className="stats">
        <p>Path length: {path.length} cells</p>
        <p>Cells visited: {visited.length}</p>
        <p>Open set size: {openSet.length}</p>
        <p>Closed set size: {closedSet.length}</p>
        <p>Status: {statusText}</p>
      </div>

      <div className="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Click on a cell to toggle obstacles.</li>
          <li>Right-click to set the start position.</li>
          <li>Double-click to set the end position.</li>
          <li>Adjust the speed, heuristic, and diagonal movement.</li>
          <li>Press "Find Path" to run the algorithm.</li>
        </ul>
      </div>
    </div>
  )
}

export default AStarVisualization
