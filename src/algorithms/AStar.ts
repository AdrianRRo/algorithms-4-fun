import { GridNode, NodePosition, PathfindingStep } from '../types/pathfinding'
import { StepColors } from '../types/colors'

type NodeRecord = {
  id: string
  row: number
  col: number
  g: number
  h: number
  f: number
}

type NeighborSummary = {
  added: string[]
  updated: string[]
}

const DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

const createId = (row: number, col: number): string => `${row}-${col}`

const manhattan = (a: NodePosition, b: NodePosition): number =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col)

const isInsideGrid = (row: number, col: number, grid: GridNode[][]): boolean =>
  row >= 0 && row < grid.length && col >= 0 && col < grid[0].length

const createNodeRecord = (
  position: NodePosition,
  goal: NodePosition,
  g: number,
): NodeRecord => {
  const h = manhattan(position, goal)
  return {
    id: createId(position.row, position.col),
    row: position.row,
    col: position.col,
    g,
    h,
    f: g + h,
  }
}

const extractLowest = (openList: NodeRecord[]): NodeRecord => {
  let bestIndex = 0

  for (let i = 1; i < openList.length; i += 1) {
    const candidate = openList[i]
    const best = openList[bestIndex]

    if (candidate.f < best.f || (candidate.f === best.f && candidate.h < best.h)) {
      bestIndex = i
    }
  }

  return openList.splice(bestIndex, 1)[0]
}

const formatPosition = (row: number, col: number): string => `(${row}, ${col})`

const determineNodeColor = (
  node: GridNode,
  openSet: Set<string>,
  closedSet: Set<string>,
  currentId: string | undefined,
  pathSet: Set<string>,
): StepColors => {
  if (node.isStart) {
    return StepColors.PATHFIND_START
  }
  if (node.isGoal) {
    return StepColors.PATHFIND_GOAL
  }
  if (node.isWall) {
    return StepColors.PATHFIND_WALL
  }
  if (pathSet.has(node.id)) {
    return StepColors.PATHFIND_PATH
  }
  if (currentId && node.id === currentId) {
    return StepColors.PATHFIND_CURRENT
  }
  if (openSet.has(node.id)) {
    return StepColors.PATHFIND_OPEN
  }
  if (closedSet.has(node.id)) {
    return StepColors.PATHFIND_CLOSED
  }
  return StepColors.DEFAULT
}

const idToPosition = (id: string): NodePosition => {
  const [row, col] = id.split('-').map(Number)
  return { row, col }
}

const createStep = (
  grid: GridNode[][],
  openSet: Set<string>,
  closedSet: Set<string>,
  currentId: string | undefined,
  pathSet: Set<string>,
  description: string,
): PathfindingStep => {
  const snapshot = grid.map((row) =>
    row.map((node) => ({
      ...node,
      color: determineNodeColor(node, openSet, closedSet, currentId, pathSet),
    })),
  )

  return {
    grid: snapshot,
    metadata: {
      description,
      openSet: Array.from(openSet),
      closedSet: Array.from(closedSet),
      current: currentId ? idToPosition(currentId) : undefined,
      path: pathSet.size > 0 ? Array.from(pathSet) : undefined,
    },
  }
}

const exploreNeighbors = (
  current: NodeRecord,
  grid: GridNode[][],
  goal: NodePosition,
  openList: NodeRecord[],
  openSet: Set<string>,
  closedSet: Set<string>,
  gScores: Map<string, number>,
  parents: Map<string, string | null>,
): NeighborSummary => {
  const summary: NeighborSummary = { added: [], updated: [] }
  const currentG = gScores.get(current.id) ?? Infinity

  for (const [dRow, dCol] of DIRECTIONS) {
    const row = current.row + dRow
    const col = current.col + dCol

    if (!isInsideGrid(row, col, grid)) {
      continue
    }

    const neighborNode = grid[row][col]

    if (neighborNode.isWall) {
      continue
    }

    const neighborId = neighborNode.id

    if (closedSet.has(neighborId)) {
      continue
    }

    const tentativeG = currentG + 1
    const previousG = gScores.get(neighborId)

    if (!openSet.has(neighborId)) {
      const record = createNodeRecord({ row, col }, goal, tentativeG)
      openList.push(record)
      openSet.add(neighborId)
      gScores.set(neighborId, tentativeG)
      parents.set(neighborId, current.id)
      summary.added.push(formatPosition(row, col))
      continue
    }

    if (tentativeG < (previousG ?? Infinity)) {
      gScores.set(neighborId, tentativeG)
      parents.set(neighborId, current.id)
      const existing = openList.find((node) => node.id === neighborId)

      if (existing) {
        existing.g = tentativeG
        existing.f = tentativeG + existing.h
      }

      summary.updated.push(formatPosition(row, col))
    }
  }

  return summary
}

const buildDescription = (current: NodeRecord, summary: NeighborSummary): string => {
  const base = `Explorando nodo ${formatPosition(current.row, current.col)}.`

  if (summary.added.length === 0 && summary.updated.length === 0) {
    return `${base} Sin vecinos nuevos.`
  }

  const additions =
    summary.added.length > 0 ? ` Nuevos vecinos: ${summary.added.join(', ')}.` : ''
  const updates =
    summary.updated.length > 0
      ? ` Actualizaciones de coste: ${summary.updated.join(', ')}.`
      : ''

  return `${base}${additions}${updates}`
}

const reconstructPath = (
  parents: Map<string, string | null>,
  goalId: string,
): Set<string> => {
  const path = new Set<string>()
  let current: string | null | undefined = goalId

  while (current) {
    path.add(current)
    current = parents.get(current) ?? null
  }

  return path
}

export const createAStarGrid = (
  rows: number,
  cols: number,
  start: NodePosition,
  goal: NodePosition,
  walls: NodePosition[] = [],
): GridNode[][] => {
  const wallSet = new Set(walls.map((wall) => createId(wall.row, wall.col)))

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const id = createId(row, col)
      const isStart = row === start.row && col === start.col
      const isGoal = row === goal.row && col === goal.col
      const isWall = wallSet.has(id)

      let color = StepColors.DEFAULT

      if (isWall) {
        color = StepColors.PATHFIND_WALL
      }
      if (isGoal) {
        color = StepColors.PATHFIND_GOAL
      }
      if (isStart) {
        color = StepColors.PATHFIND_START
      }

      return {
        id,
        row,
        col,
        color,
        isStart,
        isGoal,
        isWall,
      }
    }),
  )
}

export const aStar = (
  grid: GridNode[][],
  start: NodePosition,
  goal: NodePosition,
): PathfindingStep[] => {
  if (grid.length === 0 || grid[0].length === 0) {
    return []
  }

  const steps: PathfindingStep[] = []
  const openList: NodeRecord[] = []
  const openSet = new Set<string>()
  const closedSet = new Set<string>()
  const gScores = new Map<string, number>()
  const parents = new Map<string, string | null>()

  const startRecord = createNodeRecord(start, goal, 0)
  openList.push(startRecord)
  openSet.add(startRecord.id)
  gScores.set(startRecord.id, 0)
  parents.set(startRecord.id, null)

  steps.push(
    createStep(
      grid,
      openSet,
      closedSet,
      undefined,
      new Set<string>(),
      'Estado inicial: nodo de inicio en la frontera abierta.',
    ),
  )

  const goalId = createId(goal.row, goal.col)

  while (openList.length > 0) {
    const current = extractLowest(openList)
    openSet.delete(current.id)
    closedSet.add(current.id)

    if (current.id === goalId) {
      const pathNodes = reconstructPath(parents, current.id)
      steps.push(
        createStep(
          grid,
          openSet,
          closedSet,
          current.id,
          pathNodes,
          'Meta alcanzada: se muestra el camino óptimo.',
        ),
      )
      return steps
    }

    const summary = exploreNeighbors(
      current,
      grid,
      goal,
      openList,
      openSet,
      closedSet,
      gScores,
      parents,
    )

    steps.push(
      createStep(
        grid,
        openSet,
        closedSet,
        current.id,
        new Set<string>(),
        buildDescription(current, summary),
      ),
    )
  }

  steps.push(
    createStep(
      grid,
      openSet,
      closedSet,
      undefined,
      new Set<string>(),
      'No se encontró un camino al objetivo.',
    ),
  )

  return steps
}
