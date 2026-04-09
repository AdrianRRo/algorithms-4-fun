import { WeightedAdjacencyList } from '../types/graphs';

type QueueEntry = {
  node: string;
  score: number;
};

class PriorityQueue {
  private heap: QueueEntry[] = [];

  push(entry: QueueEntry): void {
    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): QueueEntry | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return top;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[index].score < this.heap[parentIndex].score) {
      this.swap(index, parentIndex);
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number): void {
    const leftChild = index * 2 + 1;
    const rightChild = index * 2 + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.heap[leftChild].score < this.heap[smallest].score) {
      smallest = leftChild;
    }

    if (rightChild < this.heap.length && this.heap[rightChild].score < this.heap[smallest].score) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.bubbleDown(smallest);
    }
  }

  private swap(a: number, b: number): void {
    const temp = this.heap[a];
    this.heap[a] = this.heap[b];
    this.heap[b] = temp;
  }
}

const normalizeGraph = (
  graph: WeightedAdjacencyList,
  start: string,
): { adjacency: WeightedAdjacencyList; nodes: string[] } => {
  const adjacency: WeightedAdjacencyList = { ...graph };

  if (!adjacency[start]) {
    adjacency[start] = [];
  }

  const nodes = new Set<string>([start]);

  Object.entries(adjacency).forEach(([node, edges]) => {
    nodes.add(node);
    edges?.forEach((edge) => {
      nodes.add(edge.to);
      if (!adjacency[edge.to]) {
        adjacency[edge.to] = [];
      }
    });
  });

  nodes.forEach((node) => {
    if (!adjacency[node]) {
      adjacency[node] = [];
    }
  });

  return { adjacency, nodes: Array.from(nodes) };
};

/**
 * Implementación del algoritmo A* (A-Star) para grafos dirigidos ponderados.
 * Complejidad temporal: O((V + E) log V) en su implementación con cola de prioridad.
 */
export const aStar = (
  graph: WeightedAdjacencyList,
  start: string,
  goal: string,
  heuristic: (node: string) => number,
): { distances: Map<string, number>; previous: Map<string, string> } => {
  const { adjacency, nodes } = normalizeGraph(graph, start);
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const estimatedCosts = new Map<string, number>();
  const queue = new PriorityQueue();

  nodes.forEach((node) => {
    distances.set(node, Number.POSITIVE_INFINITY);
    estimatedCosts.set(node, Number.POSITIVE_INFINITY);
  });

  distances.set(start, 0);
  const initialEstimate = heuristic(start);
  estimatedCosts.set(start, initialEstimate);
  queue.push({ node: start, score: initialEstimate });

  while (!queue.isEmpty()) {
    const current = queue.pop();
    if (!current) {
      continue;
    }

    const { node: currentNode, score: currentScore } = current;
    const storedEstimate = estimatedCosts.get(currentNode);

    if (storedEstimate === undefined || currentScore > storedEstimate) {
      continue;
    }

    if (currentNode === goal) {
      break;
    }

    const currentDistance = distances.get(currentNode) ?? Number.POSITIVE_INFINITY;
    const neighbors = adjacency[currentNode] ?? [];

    neighbors.forEach((edge) => {
      const tentativeDistance = currentDistance + edge.weight;
      const knownDistance = distances.get(edge.to) ?? Number.POSITIVE_INFINITY;

      if (tentativeDistance < knownDistance) {
        distances.set(edge.to, tentativeDistance);
        previous.set(edge.to, currentNode);
        const estimate = tentativeDistance + heuristic(edge.to);
        estimatedCosts.set(edge.to, estimate);
        queue.push({ node: edge.to, score: estimate });
      }
    });
  }

  return { distances, previous };
};
