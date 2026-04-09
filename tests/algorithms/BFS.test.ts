import { describe, it, expect } from 'vitest';
import { bfs } from '../../src/algorithms/BFS';
import { WeightedAdjacencyList } from '../../src/types/graphs';

describe('bfs', () => {
  it('calcula las distancias en un grafo simple', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 1 }],
      B: [{ to: 'C', weight: 2 }],
      C: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('A')).toBe(0);
    expect(result.distances.get('C')).toBe(2);
    expect(result.previous.get('C')).toBe('B');
    expect(result.previous.get('B')).toBe('A');
  });

  it('mantiene infinito para vértices desconectados', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 2 }],
      B: [],
      C: [],
      D: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('C')).toBe(Number.POSITIVE_INFINITY);
    expect(result.distances.get('D')).toBe(Number.POSITIVE_INFINITY);
    expect(result.previous.has('C')).toBe(false);
  });

  it('maneja un grafo de un solo nodo', () => {
    const graph: WeightedAdjacencyList = {
      A: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('A')).toBe(0);
    expect(result.previous.has('A')).toBe(false);
  });

  it('retorna infinito cuando no hay ruta hacia un nodo', () => {
    const graph: WeightedAdjacencyList = {
      A: [{ to: 'B', weight: 3 }],
      B: [],
      C: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('C')).toBe(Number.POSITIVE_INFINITY);
    expect(result.previous.has('C')).toBe(false);
  });

  it('agrega el nodo inicial aunque no exista en las claves', () => {
    const graph: WeightedAdjacencyList = {
      B: [{ to: 'C', weight: 4 }],
      C: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('A')).toBe(0);
    expect(result.distances.get('B')).toBe(Number.POSITIVE_INFINITY);
    expect(result.previous.has('A')).toBe(false);
    expect(result.previous.has('B')).toBe(false);
  });

  it('elige la ruta con menor cantidad de aristas cuando existen múltiples caminos', () => {
    const graph: WeightedAdjacencyList = {
      A: [
        { to: 'B', weight: 4 },
        { to: 'C', weight: 2 },
      ],
      B: [{ to: 'D', weight: 5 }],
      C: [
        { to: 'B', weight: 1 },
        { to: 'D', weight: 7 },
      ],
      D: [],
    };

    const result = bfs(graph, 'A');

    expect(result.distances.get('D')).toBe(2);
    expect(result.previous.get('D')).toBe('B');
    expect(result.previous.get('B')).toBe('A');
    expect(result.previous.get('C')).toBe('A');
  });
});
