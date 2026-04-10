# Algorithms 4 Fun

Interactive playground of classic algorithms built with React, TypeScript, and Python. Each page explains how the algorithm works, lets you experiment with sample data, and now includes a Python counterpart for quick experimentation from the command line.

## Algorithms

| Algorithm | Category | Highlights |
| --- | --- | --- |
| Bubble Sort | Sorting | Visualizes successive swaps until the list is sorted |
| Insertion Sort | Sorting | Shows how elements are inserted into the growing prefix |
| Quick Sort | Sorting | Demonstrates pivot selection and partitioning |
| Selection Sort | Sorting | Illustrates picking the smallest remaining element |
| Binary Search | Searching | Explains divide-and-conquer on a sorted array |
| Breadth-First Search (BFS) | Graph traversal | Finds shortest unweighted paths level by level |
| A* Search | Pathfinding | Uses heuristics to guide the search towards the goal |
| Dijkstra | Shortest path | Computes minimal cost paths on weighted graphs |

## Dijkstra's Algorithm

Dijkstra resuelve el problema del camino más corto en grafos dirigidos con pesos no negativos. Parte de un nodo fuente y expande la frontera de exploración con una cola de prioridad, garantizando que cada nodo sale con la distancia óptima. Es ideal para mapas, redes de telecomunicaciones y sistemas de recomendación donde los costes varían entre aristas.

### Pseudocode

```text
function dijkstra(graph, start):
    distances := map with default infinity
    distances[start] := 0
    previous := empty map
    queue := min-priority queue containing (start, 0)

    while queue is not empty:
        (node, distance) := queue.pop()
        if distance > distances[node]:
            continue

        for each edge in graph[node]:
            alt := distance + edge.weight
            if alt < distances[edge.to]:
                distances[edge.to] := alt
                previous[edge.to] := node
                queue.push((edge.to, alt))

    return distances, previous
```

- **Complejidad temporal:** \(O((V + E) \log V)\)
- **Complejidad espacial:** \(O(V)\)

### Example walk-through

Using the sample graph shipped with the app:

- A → B (4), A → C (2)
- B → C (5), B → D (10)
- C → E (3)
- E → D (4)
- D → F (11)

1. Inicializamos distancias con ∞ y fijamos `dist[A] = 0`.
2. Expansión de `A` actualiza `dist[B] = 4` y `dist[C] = 2`.
3. Desencolamos `C` (2) antes que `B` (4): `dist[E]` se vuelve 5 y `previous[E] = C`.
4. Desde `E` actualizamos `dist[D] = 9` con predecesor `E`.
5. Al procesar `D` establecemos `dist[F] = 20` y `previous[F] = D`.
6. La cola descarta rutas más largas automáticamente; el camino más corto A → C → E → D → F suma 20.

### How it compares

- **BFS** encuentra el menor número de aristas, pero ignora los pesos. Solo es correcto en grafos con peso uniforme.
- **A*** combina coste real y heurística: convergerá más rápido si disponemos de una estimación admisible hacia el objetivo. Dijkstra puede verse como A* con heurística nula.

## Running

```bash
yarn dev                # Ejecutar la UI de Vite
yarn test               # Pruebas de TypeScript
python src/python/dijkstra.py  # Ejecutar el ejemplo en consola
pytest src/python/test_dijkstra.py  # Pruebas unitarias de Python
```

¡Listo para explorar algoritmos tanto en el navegador como en la terminal!
