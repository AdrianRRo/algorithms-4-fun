# algorithms-4-fun

Interactive algorithm visualizations built with React + TypeScript + Vite.

## Algorithms

### Sorting

| Algorithm | Time Complexity | Space Complexity | Page |
|-----------|----------------|-----------------|------|
| Bubble Sort | O(n²) | O(1) | `src/pages/BubbleSort/` |
| Selection Sort | O(n²) | O(1) | `src/pages/SelectionSort/` |
| Insertion Sort | O(n²) | O(1) | `src/pages/InsertionSort/` |
| Quick Sort | O(n log n) avg | O(log n) | `src/pages/QuickSort/` |
| **Merge Sort** | **O(n log n)** | **O(n)** | `src/pages/MergeSort/` |

### Search

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Binary Search | O(log n) | O(1) |

### Merge Sort

Divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and merges them back together. Guaranteed O(n log n) in all cases. The visualization shows each comparison (green) and placement (orange) during the merge phase.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
