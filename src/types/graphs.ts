/**
 * Tipos compartidos para representar grafos dirigidos ponderados.
 * Todas las aristas deben contar con pesos mayores o iguales a cero.
 */
export interface GraphEdge {
  /** Nodo destino de la arista. */
  to: string;
  /** Peso asociado a la arista. Debe ser un número mayor o igual que cero. */
  weight: number;
}

/**
 * Lista de adyacencia para grafos dirigidos ponderados.
 * Los nodos pueden existir en el grafo aunque no cuenten con lista de adyacencia; en ese caso
 * se asume un arreglo vacío de aristas.
 */
export type WeightedAdjacencyList = Record<string, GraphEdge[]>;

export interface DijkstraResult {
  distances: Map<string, number>;
  previous: Map<string, string>;
}
