"""Implementación del algoritmo de Dijkstra en Python.

El tiempo de ejecución es O((V + E) log V) gracias al uso de una cola de
prioridad basada en `heapq`. El espacio requerido es O(V) para almacenar las
estructuras de distancias y predecesores.
"""

from __future__ import annotations

from dataclasses import dataclass
import heapq
from typing import Iterable

WeightedGraph = dict[str, list[tuple[str, float]]]


@dataclass(slots=True)
class DijkstraResult:
  """Resultado del algoritmo de Dijkstra.

  Attributes
  ----------
  distances:
      Distancia mínima calculada desde el nodo de inicio a cada nodo.
  previous:
      Nodo previo en el camino mínimo para cada vértice alcanzable.
  """

  distances: dict[str, float]
  previous: dict[str, str]


class PriorityQueue:
  """Cola de prioridad mínima simple para manejar los nodos por explorar."""

  def __init__(self) -> None:
    self._items: list[tuple[float, str]] = []

  def push(self, priority: float, node: str) -> None:
    heapq.heappush(self._items, (priority, node))

  def pop(self) -> tuple[float, str]:
    return heapq.heappop(self._items)

  def __bool__(self) -> bool:
    return bool(self._items)


def _collect_nodes(graph: WeightedGraph, start: str) -> set[str]:
  nodes: set[str] = {start}

  for source, edges in graph.items():
    nodes.add(source)
    for destination, _ in edges:
      nodes.add(destination)

  return nodes


def _ensure_non_negative(edges: Iterable[tuple[str, float]]) -> None:
  for destination, weight in edges:
    if weight < 0:
      msg = f"Negative weight detected on edge to '{destination}': {weight}"
      raise ValueError(msg)


def dijkstra(graph: WeightedGraph, start: str) -> DijkstraResult:
  """Calcula el camino mínimo desde ``start`` a todos los nodos del grafo.

  Parameters
  ----------
  graph:
      Grafo dirigido ponderado representado como diccionario de listas de
      adyacencia.
  start:
      Nodo de inicio para la búsqueda. Debe existir al menos como destino en el
      grafo.

  Returns
  -------
  DijkstraResult
      Estructura con las distancias y nodos previos calculados.
  """

  if not start:
    raise ValueError("The start node must be a non-empty string.")

  nodes = _collect_nodes(graph, start)
  if start not in nodes:
    nodes.add(start)

  distances = {node: float("inf") for node in nodes}
  previous: dict[str, str] = {}
  distances[start] = 0.0

  priority_queue = PriorityQueue()
  priority_queue.push(0.0, start)

  while priority_queue:
    current_distance, node = priority_queue.pop()
    if current_distance > distances[node]:
      continue

    edges = graph.get(node, [])
    _ensure_non_negative(edges)

    for neighbour, weight in edges:
      tentative_distance = current_distance + float(weight)
      if tentative_distance < distances[neighbour]:
        distances[neighbour] = tentative_distance
        previous[neighbour] = node
        priority_queue.push(tentative_distance, neighbour)

  return DijkstraResult(distances=distances, previous=previous)


def get_path(result: DijkstraResult, start: str, end: str) -> list[str]:
  """Reconstruye el camino mínimo entre ``start`` y ``end``.

  Si ``end`` es inalcanzable o no existe en el grafo, se devuelve una lista
  vacía. La complejidad es O(k) donde k es la longitud del camino hallado.
  """

  if not start or not end:
    return []
  if start == end:
    return [start]
  if end not in result.distances or start not in result.distances:
    return []

  path: list[str] = []
  current: str | None = end

  while current is not None:
    path.append(current)
    if current == start:
      return list(reversed(path))
    current = result.previous.get(current)

  return []


if __name__ == "__main__":
  SAMPLE_GRAPH: WeightedGraph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("C", 5), ("D", 10)],
    "C": [("E", 3)],
    "D": [("F", 11)],
    "E": [("D", 4)],
    "F": [],
  }

  SOURCE = "A"
  TARGET = "F"

  result = dijkstra(SAMPLE_GRAPH, SOURCE)
  path = get_path(result, SOURCE, TARGET)

  print("Distances:")
  for node, distance in sorted(result.distances.items()):
    print(f"  {node}: {distance}")

  print("\nShortest path:")
  if path:
    joined_path = " -> ".join(path)
    print(f"  {joined_path} (total: {result.distances[TARGET]})")
  else:
    print("  No path found")
