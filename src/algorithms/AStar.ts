/**
 * Implementación del algoritmo A* para pathfinding en un grid 2D
 */

export interface GridCell {
  x: number;
  y: number;
  walkable: boolean;
  g: number;
  h: number;
  f: number;
  parent: GridCell | null;
}

export interface Grid2D {
  width: number;
  height: number;
  cells: GridCell[][];
}

export interface AStarResult {
  path: GridCell[];
  visited: GridCell[];
  openSet: GridCell[];
  closedSet: GridCell[];
  success: boolean;
}

export class AStar {
  private grid: Grid2D;

  private start: GridCell;

  private end: GridCell;

  private heuristic: (a: GridCell, b: GridCell) => number;

  private allowDiagonal: boolean;

  constructor(
    grid: number[][],
    start: [number, number],
    end: [number, number],
    heuristicType: 'manhattan' | 'euclidean' | 'diagonal' = 'manhattan',
    allowDiagonal: boolean = true,
  ) {
    this.grid = this.buildGrid(grid);
    this.start = this.grid.cells[start[1]][start[0]];
    this.end = this.grid.cells[end[1]][end[0]];
    this.heuristic = this.getHeuristic(heuristicType);
    this.allowDiagonal = allowDiagonal;

    this.start.walkable = true;
    this.end.walkable = true;
  }

  private buildGrid(matrix: number[][]): Grid2D {
    const height = matrix.length;
    const width = matrix[0]?.length ?? 0;
    const cells: GridCell[][] = [];

    for (let y = 0; y < height; y += 1) {
      cells[y] = [];
      for (let x = 0; x < width; x += 1) {
        cells[y][x] = {
          x,
          y,
          walkable: matrix[y][x] === 0,
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
        return (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      case 'diagonal':
        return (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
      case 'manhattan':
      default:
        return (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  }

  private getNeighbors(cell: GridCell): GridCell[] {
    const neighbors: GridCell[] = [];
    const baseDirections: Array<[number, number]> = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];
    const diagonalDirections: Array<[number, number]> = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    const directions = this.allowDiagonal
      ? [...baseDirections, ...diagonalDirections]
      : baseDirections;

    for (const [dx, dy] of directions) {
      const x = cell.x + dx;
      const y = cell.y + dy;

      if (x < 0 || x >= this.grid.width || y < 0 || y >= this.grid.height) {
        continue;
      }

      const neighbor = this.grid.cells[y][x];
      if (neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  private getCellDistance(a: GridCell, b: GridCell): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);

    if (dx !== 0 && dy !== 0) {
      return Math.SQRT2;
    }

    return 1;
  }

  public findPath(): AStarResult {
    const openSet: GridCell[] = [this.start];
    const closedSet: GridCell[] = [];
    const visited: GridCell[] = [];

    this.start.g = 0;
    this.start.h = this.heuristic(this.start, this.end);
    this.start.f = this.start.h;

    while (openSet.length > 0) {
      let currentIndex = 0;
      let current = openSet[0];

      for (let i = 1; i < openSet.length; i += 1) {
        const candidate = openSet[i];
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
          openSet: [...openSet],
          closedSet: [...closedSet],
          success: true,
        };
      }

      openSet.splice(currentIndex, 1);
      closedSet.push(current);
      visited.push(current);

      const neighbors = this.getNeighbors(current);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) {
          continue;
        }

        const tentativeG = current.g + this.getCellDistance(current, neighbor);

        const inOpenSet = openSet.includes(neighbor);
        if (!inOpenSet || tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = this.heuristic(neighbor, this.end);
          neighbor.f = neighbor.g + neighbor.h;

          if (!inOpenSet) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return {
      path: [],
      visited,
      openSet: [],
      closedSet: [],
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

    for (let y = 0; y < height; y += 1) {
      grid[y] = [];
      for (let x = 0; x < width; x += 1) {
        grid[y][x] = Math.random() < obstacleProbability ? 1 : 0;
      }
    }

    return grid;
  }
}

