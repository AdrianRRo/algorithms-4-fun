import { BFSResult, WeightedAdjacencyList } from '../types/graphs';

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
 * Implementación del algoritmo de búsqueda en anchura (BFS) para grafos dirigidos sin pesos.
 * Complejidad temporal: O(V + E).
 */
export const bfs = (graph: WeightedAdjacencyList, start: string): BFSResult => {
  const { adjacency, nodes } = normalizeGraph(graph, start);
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const queue: string[] = [];

  nodes.forEach((node) => {
    distances.set(node, Number.POSITIVE_INFINITY);
  });

  distances.set(start, 0);
  queue.push(start);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    const currentDistance = distances.get(current) ?? Number.POSITIVE_INFINITY;
    const neighbors = adjacency[current] ?? [];

    neighbors.forEach((edge) => {
      const knownDistance = distances.get(edge.to) ?? Number.POSITIVE_INFINITY;
      const alternativeDistance = currentDistance + 1;

      if (alternativeDistance < knownDistance) {
        distances.set(edge.to, alternativeDistance);
        previous.set(edge.to, current);
        queue.push(edge.to);
      }
    });
  }

  return { distances, previous };
};
