import { describe, expect, it } from 'vitest';
import { aStar } from '../../src/algorithms/AStar';
import { WeightedAdjacencyList } from '../../src/types/graphs';

describe('aStar', () => {
  it('encuentra la ruta directa en un grafo simple', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 1 }],
      B: [],
    };

    const result = aStar(graph, 'A', 'B', () => 0);

    expect(result.distances.get('A')).toBe(0);
    expect(result.distances.get('B')).toBe(1);
    expect(result.previous.get('B')).toBe('A');
  });

  it('acumula correctamente los pesos a lo largo de la ruta', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 2 }],
      B: [{ to: 'C', weight: 3 }],
      C: [],
    };

    const result = aStar(graph, 'A', 'C', () => 0);

    expect(result.distances.get('A')).toBe(0);
    expect(result.distances.get('B')).toBe(2);
    expect(result.distances.get('C')).toBe(5);
    expect(result.previous.get('C')).toBe('B');
    expect(result.previous.get('B')).toBe('A');
  });

  it('retorna infinito cuando no existe un camino al objetivo', () => {
    const graph: WeightedAdjacencyList = {
      A: [],
      B: [],
    };

    const result = aStar(graph, 'A', 'B', () => 0);

    expect(result.distances.get('B')).toBe(Number.POSITIVE_INFINITY);
    expect(result.previous.has('B')).toBe(false);
  });

  it('maneja el caso donde el nodo inicial es también el objetivo', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 2 }],
      B: [],
    };

    const result = aStar(graph, 'A', 'A', () => 0);

    expect(result.distances.get('A')).toBe(0);
    expect(result.previous.has('A')).toBe(false);
    expect(result.distances.get('B')).toBe(Number.POSITIVE_INFINITY);
  });

  it('explora grafos con ciclos utilizando la heurística provista', () => {
    const graph: WeightedAdjacencyList = {
      A: [
        { to: 'B', weight: 1 },
        { to: 'C', weight: 10 },
      ],
      B: [
        { to: 'C', weight: 2 },
        { to: 'A', weight: 4 },
        { to: 'D', weight: 2 },
      ],
      C: [
        { to: 'A', weight: 3 },
        { to: 'D', weight: 1 },
      ],
      D: [{ to: 'B', weight: 1 }],
    };

    const heuristicValues: Record<string, number> = {
      A: 3,
      B: 2,
      C: 1,
      D: 0,
    };

    const heuristic = (node: string) => heuristicValues[node] ?? 0;

    const result = aStar(graph, 'A', 'D', heuristic);

    expect(result.distances.get('D')).toBe(3);
    expect(result.previous.get('D')).toBe('B');
    expect(result.previous.get('B')).toBe('A');
  });
});
