export interface GraphOptions<T> {
  directed?: boolean;
  vertices?: Iterable<T>;
}

export interface TraversalOptions<T> {
  onVisit?: (vertex: T) => void;
}

export class Graph<T> {
  private readonly adjacencyList: Map<T, Set<T>> = new Map();
  private readonly directed: boolean;

  constructor(options: GraphOptions<T> = {}) {
    const { directed = false, vertices } = options;
    this.directed = directed;

    if (vertices) {
      for (const vertex of vertices) {
        this.addVertex(vertex);
      }
    }
  }

  public isDirected(): boolean {
    return this.directed;
  }

  public vertexCount(): number {
    return this.adjacencyList.size;
  }

  public edgeCount(): number {
    let total = 0;

    for (const neighbors of this.adjacencyList.values()) {
      total += neighbors.size;
    }

    return this.directed ? total : total / 2;
  }

  public addVertex(vertex: T): this {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Set());
    }

    return this;
  }

  public addEdge(source: T, target: T): this {
    this.addVertex(source);
    this.addVertex(target);

    this.adjacencyList.get(source)?.add(target);

    if (!this.directed) {
      this.adjacencyList.get(target)?.add(source);
    }

    return this;
  }

  public removeEdge(source: T, target: T): this {
    this.adjacencyList.get(source)?.delete(target);

    if (!this.directed) {
      this.adjacencyList.get(target)?.delete(source);
    }

    return this;
  }

  public removeVertex(vertex: T): this {
    if (!this.adjacencyList.has(vertex)) {
      return this;
    }

    this.adjacencyList.delete(vertex);

    for (const neighbors of this.adjacencyList.values()) {
      neighbors.delete(vertex);
    }

    return this;
  }

  public hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  public hasEdge(source: T, target: T): boolean {
    return this.adjacencyList.get(source)?.has(target) ?? false;
  }

  public neighbors(vertex: T): T[] {
    return Array.from(this.adjacencyList.get(vertex) ?? []);
  }

  public breadthFirstTraversal(start: T, options: TraversalOptions<T> = {}): T[] {
    if (!this.adjacencyList.has(start)) {
      return [];
    }

    const { onVisit } = options;
    const visited = new Set<T>();
    const order: T[] = [];
    const queue: T[] = [start];
    let index = 0;

    while (index < queue.length) {
      const vertex = queue[index++];

      if (visited.has(vertex)) {
        continue;
      }

      visited.add(vertex);
      order.push(vertex);
      onVisit?.(vertex);

      for (const neighbor of this.neighbors(vertex)) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    return order;
  }

  public depthFirstTraversal(start: T, options: TraversalOptions<T> = {}): T[] {
    if (!this.adjacencyList.has(start)) {
      return [];
    }

    const { onVisit } = options;
    const visited = new Set<T>();
    const order: T[] = [];
    const stack: T[] = [start];

    while (stack.length > 0) {
      const vertex = stack.pop() as T;

      if (visited.has(vertex)) {
        continue;
      }

      visited.add(vertex);
      order.push(vertex);
      onVisit?.(vertex);

      const neighbors = this.neighbors(vertex);

      for (let i = neighbors.length - 1; i >= 0; i -= 1) {
        const neighbor = neighbors[i];

        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    return order;
  }

  public toAdjacencyList(): Map<T, Set<T>> {
    const clone = new Map<T, Set<T>>();

    for (const [vertex, neighbors] of this.adjacencyList.entries()) {
      clone.set(vertex, new Set(neighbors));
    }

    return clone;
  }

  public clear(): this {
    this.adjacencyList.clear();
    return this;
  }
}
