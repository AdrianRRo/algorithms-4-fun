import { DijkstraResult, WeightedAdjacencyList } from '../types/graphs';

type QueueEntry = {
  node: string;
  distance: number;
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
    if (this.heap[index].distance < this.heap[parentIndex].distance) {
      this.swap(index, parentIndex);
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number): void {
    const leftChild = index * 2 + 1;
    const rightChild = index * 2 + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.heap[leftChild].distance < this.heap[smallest].distance) {
      smallest = leftChild;
    }

    if (rightChild < this.heap.length && this.heap[rightChild].distance < this.heap[smallest].distance) {
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
 * Implementación del algoritmo de Dijkstra para grafos dirigidos con pesos no negativos.
 * Complejidad temporal: O((V + E) log V).
 */
export const dijkstra = (graph: WeightedAdjacencyList, start: string): DijkstraResult => {
  const { adjacency, nodes } = normalizeGraph(graph, start);
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const queue = new PriorityQueue();

  nodes.forEach((node) => {
    distances.set(node, Number.POSITIVE_INFINITY);
  });

  distances.set(start, 0);
  queue.push({ node: start, distance: 0 });

  while (!queue.isEmpty()) {
    const current = queue.pop();
    if (!current) {
      break;
    }

    const { node: currentNode, distance: currentDistance } = current;
    const storedDistance = distances.get(currentNode);

    if (storedDistance === undefined || currentDistance > storedDistance) {
      continue;
    }

    const neighbors = adjacency[currentNode] ?? [];

    neighbors.forEach((edge) => {
      const alternativeDistance = currentDistance + edge.weight;
      const knownDistance = distances.get(edge.to) ?? Number.POSITIVE_INFINITY;

      if (alternativeDistance < knownDistance) {
        distances.set(edge.to, alternativeDistance);
        previous.set(edge.to, currentNode);
        queue.push({ node: edge.to, distance: alternativeDistance });
      }
    });
  }

  return { distances, previous };
};
