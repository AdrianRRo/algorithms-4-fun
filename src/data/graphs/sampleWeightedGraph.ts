import { WeightedAdjacencyList } from '../../types/graphs';

export const sampleWeightedGraph: WeightedAdjacencyList = {
  A: [
    { to: 'B', weight: 4 },
    { to: 'C', weight: 2 },
  ],
  B: [
    { to: 'C', weight: 5 },
    { to: 'D', weight: 10 },
  ],
  C: [{ to: 'E', weight: 3 }],
  D: [{ to: 'F', weight: 11 }],
  E: [{ to: 'D', weight: 4 }],
  F: [],
};

/**
 * Obtiene todos los nodos presentes en una lista de adyacencia dirigida ponderada.
 * Los nodos se devuelven siguiendo el orden en que aparecen por primera vez.
 */
export const allNodes = (graph: WeightedAdjacencyList): string[] => {
  const nodes = new Set<string>();

  Object.entries(graph).forEach(([node, edges]) => {
    nodes.add(node);
    edges.forEach((edge) => {
      nodes.add(edge.to);
    });
  });

  return Array.from(nodes);
};
