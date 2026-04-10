/**
 * Implementación del algoritmo A* para pathfinding en un grid 2D.
 */

export interface GridCell {
  row: number;
  col: number;
  walkable: boolean;
  g: number;
  h: number;
  f: number;
  parent: GridCell | null;
}

export interface PathfindingGrid {
  width: number;
  height: number;
  cells: GridCell[][];
}

export interface AStarResult {
  path: GridCell[];
  visited: GridCell[];
  openCells: GridCell[];
  closedCells: GridCell[];
  success: boolean;
}

export class AStar {
  private grid: PathfindingGrid;

  private start: GridCell;

  private end: GridCell;

  private heuristic: (a: GridCell, b: GridCell) => number;

  private allowDiagonal: boolean;

  constructor(
    gridMatrix: number[][],
    start: [number, number],
    end: [number, number],
    heuristicType: 'manhattan' | 'euclidean' | 'diagonal' = 'manhattan',
    allowDiagonal: boolean = true,
  ) {
    this.grid = this.createGrid(gridMatrix);
    const [startCol, startRow] = start;
    const [endCol, endRow] = end;
    this.start = this.grid.cells[startRow][startCol];
    this.end = this.grid.cells[endRow][endCol];
    this.heuristic = this.getHeuristic(heuristicType);
    this.allowDiagonal = allowDiagonal;

    this.start.walkable = true;
    this.end.walkable = true;
  }

  private createGrid(matrix: number[][]): PathfindingGrid {
    const height = matrix.length;
    const width = matrix[0]?.length ?? 0;
    const cells: GridCell[][] = [];

    for (let row = 0; row < height; row += 1) {
      cells[row] = [];
      for (let col = 0; col < width; col += 1) {
        cells[row][col] = {
          row,
          col,
          walkable: matrix[row][col] === 0,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
        };
      }
    }

    return { width, height, cells };
  }

  private getHeuristic(type: string): (a: GridCell, b: GridCell) => number {
    switch (type) {
      case 'euclidean':
        return (a, b) => Math.sqrt((a.col - b.col) ** 2 + (a.row - b.row) ** 2);
      case 'diagonal':
        return (a, b) => Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
      case 'manhattan':
      default:
        return (a, b) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
    }
  }

  private getNeighbors(cell: GridCell): GridCell[] {
    const neighbors: GridCell[] = [];
    const baseDirections: Array<[number, number]> = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const diagonalDirections: Array<[number, number]> = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];

    const directions = this.allowDiagonal
      ? [...baseDirections, ...diagonalDirections]
      : baseDirections;

    for (const [dRow, dCol] of directions) {
      const newRow = cell.row + dRow;
      const newCol = cell.col + dCol;

      if (
        newCol < 0 ||
        newCol >= this.grid.width ||
        newRow < 0 ||
        newRow >= this.grid.height
      ) {
        continue;
      }

      const neighbor = this.grid.cells[newRow][newCol];
      if (neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  private getDistance(a: GridCell, b: GridCell): number {
    const dCol = Math.abs(a.col - b.col);
    const dRow = Math.abs(a.row - b.row);

    if (dCol !== 0 && dRow !== 0) {
      return Math.SQRT2;
    }

    return 1;
  }

  public findPath(): AStarResult {
    const openCells: GridCell[] = [this.start];
    const closedCells: GridCell[] = [];
    const visited: GridCell[] = [];

    this.start.g = 0;
    this.start.h = this.heuristic(this.start, this.end);
    this.start.f = this.start.h;

    while (openCells.length > 0) {
      let currentIndex = 0;
      let current = openCells[0];

      for (let i = 1; i < openCells.length; i += 1) {
        const candidate = openCells[i];
        if (
          candidate.f < current.f ||
          (candidate.f === current.f && candidate.h < current.h)
        ) {
          current = candidate;
          currentIndex = i;
        }
      }

      if (current === this.end) {
        const path = this.reconstructPath(current);
        return {
          path,
          visited,
          openCells: [...openCells],
          closedCells: [...closedCells],
          success: true,
        };
      }

      openCells.splice(currentIndex, 1);
      closedCells.push(current);
      visited.push(current);

      const neighbors = this.getNeighbors(current);

      for (const neighbor of neighbors) {
        if (closedCells.includes(neighbor)) {
          continue;
        }

        const tentativeG = current.g + this.getDistance(current, neighbor);

        const inOpenCells = openCells.includes(neighbor);
        if (!inOpenCells || tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = this.heuristic(neighbor, this.end);
          neighbor.f = neighbor.g + neighbor.h;

          if (!inOpenCells) {
            openCells.push(neighbor);
          }
        }
      }
    }

    return {
      path: [],
      visited,
      openCells: [],
      closedCells: [],
      success: false,
    };
  }

  private reconstructPath(cell: GridCell): GridCell[] {
    const path: GridCell[] = [];
    let current: GridCell | null = cell;

    while (current) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  }

  public static generateRandomGrid(
    width: number,
    height: number,
    obstacleProbability: number = 0.2,
  ): number[][] {
    const grid: number[][] = [];

    for (let row = 0; row < height; row += 1) {
      grid[row] = [];
      for (let col = 0; col < width; col += 1) {
        grid[row][col] = Math.random() < obstacleProbability ? 1 : 0;
      }
    }

    return grid;
  }
}
