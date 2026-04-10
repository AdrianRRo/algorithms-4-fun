# Algorithms 4 Fun

Colección de visualizaciones interactivas y utilidades para estudiar algoritmos clásicos implementados en TypeScript/React y Python.

## Algoritmos implementados
- Bubble Sort
- Insertion Sort
- Selection Sort
- Quick Sort
- **Merge Sort** (visualización interactiva + implementación en Python y TypeScript)

### Merge Sort
Merge Sort es un algoritmo de ordenamiento con enfoque *divide y vencerás* que divide el array original en subarrays cada vez más pequeños hasta llegar a unidades indivisibles. Luego, los subarrays se fusionan en orden ascendente.

- Complejidad temporal: **O(n log n)**
- Complejidad espacial: **O(n)** (requiere buffers auxiliares durante la fusión)
- Características destacadas:
  - Implementación funcional en TypeScript (`src/algorithms/MergeSort.ts`)
  - Visualización paso a paso con controles interactivos (`src/pages/MergeSort/`)
  - Implementación de referencia y pruebas en Python (`src/python/merge_sort.py`)

## Desarrollo
1. Instalar dependencias:
   ```bash
yarn install
   ```
2. Ejecutar el entorno de desarrollo (Vite):
   ```bash
yarn dev
   ```
3. Abrir `http://localhost:5173` en el navegador para explorar las visualizaciones.

## Pruebas
- Pruebas de TypeScript (Vitest):
  ```bash
yarn test
  ```
- Pruebas de Python (pytest):
  ```bash
pytest src/python
  ```

## Estructura destacada
- `src/algorithms/` — Implementaciones en TypeScript de los algoritmos.
- `src/pages/` — Componentes React con visualizaciones.
- `src/python/` — Implementaciones y pruebas en Python para validación adicional.

¡Explora, modifica y aprende algoritmos con visualizaciones amigables y código acompañante! :rocket:
