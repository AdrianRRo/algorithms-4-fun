import { UnweightedAdjacencyMap } from '../../types/graphs';

const rawGraph: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['E', 'F'],
  D: ['G'],
  E: ['G'],
  F: [],
  G: [],
};

export const sampleUnweightedGraph: UnweightedAdjacencyMap = new Map(
  Object.entries(rawGraph),
);

/**
 * Obtiene todos los nodos presentes en una lista de adyacencia no ponderada.
 * Los nodos se devuelven siguiendo el orden en que aparecen por primera vez.
 */
export const unweightedNodes = (graph: UnweightedAdjacencyMap): string[] => {
  const nodes = new Set<string>();

  graph.forEach((neighbors, node) => {
    nodes.add(node);
    neighbors.forEach((neighbor) => {
      nodes.add(neighbor);
    });
  });

  return Array.from(nodes);
};
