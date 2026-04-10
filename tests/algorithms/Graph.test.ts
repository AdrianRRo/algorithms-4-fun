import { describe, it, expect, vi } from 'vitest';
import { Graph } from '../../src/algorithms/Graph';

describe('Graph data structure', () => {
  it('añade vértices y aristas sin duplicados', () => {
    const graph = new Graph<string>();

    graph.addVertex('A').addVertex('A');
    graph.addEdge('A', 'B').addEdge('A', 'B');

    expect(graph.vertexCount()).toBe(2);
    expect(graph.edgeCount()).toBe(1);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
  });

  it('recorre el grafo en anchura (BFS)', () => {
    const graph = new Graph<string>();

    graph
      .addEdge('A', 'B')
      .addEdge('A', 'C')
      .addEdge('B', 'D')
      .addEdge('B', 'F')
      .addEdge('C', 'E');

    const order = graph.breadthFirstTraversal('A');
    expect(order).toEqual(['A', 'B', 'C', 'D', 'F', 'E']);
  });

  it('recorre el grafo en profundidad (DFS)', () => {
    const graph = new Graph<string>();

    graph
      .addEdge('A', 'B')
      .addEdge('A', 'C')
      .addEdge('B', 'D')
      .addEdge('C', 'E');

    const order = graph.depthFirstTraversal('A');
    expect(order).toEqual(['A', 'B', 'D', 'C', 'E']);
  });

  it('soporta grafos dirigidos', () => {
    const graph = new Graph<string>({ directed: true });

    graph
      .addEdge('A', 'B')
      .addEdge('B', 'C');

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(false);
    expect(graph.edgeCount()).toBe(2);

    const bfs = graph.breadthFirstTraversal('A');
    expect(bfs).toEqual(['A', 'B', 'C']);
  });

  it('elimina vértices y aristas correctamente', () => {
    const graph = new Graph<number>();

    graph
      .addEdge(1, 2)
      .addEdge(2, 3)
      .addEdge(3, 4);

    graph.removeEdge(2, 3);
    expect(graph.hasEdge(2, 3)).toBe(false);

    graph.removeVertex(3);
    expect(graph.hasVertex(3)).toBe(false);
    expect(graph.hasEdge(3, 4)).toBe(false);
    expect(graph.edgeCount()).toBe(1);
  });

  it('invoca el callback onVisit durante los recorridos', () => {
    const graph = new Graph<number>();
    const onVisit = vi.fn();

    graph.addEdge(1, 2).addEdge(1, 3);

    graph.breadthFirstTraversal(1, { onVisit });
    expect(onVisit).toHaveBeenCalledTimes(3);
    expect(onVisit).toHaveBeenNthCalledWith(1, 1);
  });

  it('retorna un listado vacío si el vértice inicial no existe', () => {
    const graph = new Graph<string>();
    expect(graph.breadthFirstTraversal('X')).toEqual([]);
    expect(graph.depthFirstTraversal('X')).toEqual([]);
  });
});
