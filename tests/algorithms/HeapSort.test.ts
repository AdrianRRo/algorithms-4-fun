import { describe, it, expect } from 'vitest';
import { heapSort } from '../../src/algorithms/HeapSort';
import { Item } from '../../src/types/algorithms';
import { StepColors } from '../../src/types/colors';

const createItems = (values: number[]): Item[] =>
  values.map((value) => ({ value, color: StepColors.DEFAULT }));

describe('heapSort', () => {
  it('handles empty array', () => {
    const arr: Item[] = [];
    const steps = heapSort(arr);
    expect(steps).toHaveLength(1);
    expect(steps[0].array).toEqual([]);
  });

  it('handles single element', () => {
    const arr = createItems([42]);
    const steps = heapSort(arr);
    expect(steps).toHaveLength(1);
    expect(steps[0].array.map((item) => item.value)).toEqual([42]);
  });

  it('sorts already sorted array', () => {
    const arr = createItems([1, 2, 3, 4]);
    const steps = heapSort(arr);
    expect(steps[steps.length - 1].array.map((item) => item.value)).toEqual([1, 2, 3, 4]);
  });

  it('sorts reverse sorted array', () => {
    const arr = createItems([4, 3, 2, 1]);
    const steps = heapSort(arr);
    expect(steps[steps.length - 1].array.map((item) => item.value)).toEqual([1, 2, 3, 4]);
  });

  it('handles duplicates', () => {
    const arr = createItems([2, 1, 2, 3]);
    const steps = heapSort(arr);
    expect(steps[steps.length - 1].array.map((item) => item.value)).toEqual([1, 2, 2, 3]);
  });

  it('handles negatives', () => {
    const arr = createItems([-1, 3, -5, 0]);
    const steps = heapSort(arr);
    expect(steps[steps.length - 1].array.map((item) => item.value)).toEqual([-5, -1, 0, 3]);
  });

  it('has metadata in steps', () => {
    const arr = createItems([3, 1]);
    const steps = heapSort(arr);
    expect(steps[0]).toHaveProperty('metadata');
  });
});