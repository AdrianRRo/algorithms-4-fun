import { HeapSortStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { resetColors, setColors, swap } from "./common";

const cloneItems = (items: Item[]): Item[] =>
  items.map((item) => ({ value: item.value, color: item.color }));

const arraysMatch = (left: Item[], right: Item[]): boolean =>
  left.length === right.length &&
  left.every(
    (item, index) =>
      item.value === right[index].value && item.color === right[index].color,
  );

const pushStep = (steps: BaseStep[], arr: Item[], metadata?: Record<string, any>): void => {
  const snapshot = cloneItems(arr);
  const lastStep = steps[steps.length - 1];

  if (!lastStep || !arraysMatch(lastStep.array, snapshot)) {
    steps.push({ array: snapshot, metadata });
  }
};

function heapify(
  arr: Item[], 
  n: number, 
  i: number, 
  steps: BaseStep[], 
  phase: 'build' | 'extract'
): void {
  let largest = i;
  const indices: number[] = [i];

  let left = 2 * i + 1;
  if (left < n) {
    indices.push(left);
    if (arr[left].value > arr[largest].value) {
      largest = left;
    }
  }

  let right = 2 * i + 2;
  if (right < n) {
    indices.push(right);
    if (arr[right].value > arr[largest].value) {
      largest = right;
    }
  }

  const coloredItems = indices.map(idx => ({ value: arr[idx].value, color: StepColors.HANDLING }));
  arr = setColors(arr, coloredItems, 0, n - 1, true);
  pushStep(steps, arr, { phase, highlightedIndices: indices });

  if (largest !== i) {
    swap(arr, i, largest);
    const swappedColored = [{ value: arr[i].value, color: StepColors.SWAP }, { value: arr[largest].value, color: StepColors.SWAP }];
    arr = setColors(arr, swappedColored, 0, n - 1, true);
    pushStep(steps, arr, { phase, highlightedIndices: indices, swapped: [i, largest] as [number, number] });

    heapify(arr, n, largest, steps, phase);
  }

  // Clear highlights
  arr = setColors(arr, [], 0, n - 1, true);
  pushStep(steps, arr, { phase });
}

export const heapSort = (array: Item[]): BaseStep[] => {
  const steps: BaseStep[] = [];
  let arr = cloneItems(array);
  pushStep(steps, arr);

  const n = arr.length;
  if (n <= 1) {
    return steps;
  }

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps, 'build');
  }

  // Extract max elements
  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i);
    const swappedColored = [{ value: arr[0].value, color: StepColors.SWAP }, { value: arr[i].value, color: StepColors.SWAP }];
    arr = setColors(arr, swappedColored, i + 1, n - 1, true);
    pushStep(steps, arr, { phase: 'extract' as const, swapped: [0, i] as [number, number] });

    heapify(arr, i, 0, steps, 'extract');
  }

  return steps;
};