import { describe, expect, it } from 'vitest';
import {
  MergeSortStep,
  getMergeSortSteps,
  merge,
  mergeSort,
} from '../../src/algorithms/MergeSort';

const buildPseudoRandomArray = (length: number): number[] => {
  const result: number[] = [];
  let seed = 97;

  for (let index = 0; index < length; index += 1) {
    seed = (seed * 73 + 41) % 997;
    result.push(seed - 500);
  }

  return result;
};

describe('merge', () => {
  it('fusiona dos arrays ordenados con duplicados', () => {
    expect(merge([1, 2, 2, 5], [2, 3, 4])).toStrictEqual([1, 2, 2, 2, 3, 4, 5]);
  });

  it('devuelve un nuevo array sin mutar las entradas', () => {
    const left = [1, 4, 7];
    const right = [2, 5, 6];
    const merged = merge(left, right);

    expect(merged).toStrictEqual([1, 2, 4, 5, 6, 7]);
    expect(left).toStrictEqual([1, 4, 7]);
    expect(right).toStrictEqual([2, 5, 6]);
  });
});

describe('mergeSort', () => {
  it('ordena un array vacío', () => {
    expect(mergeSort([])).toStrictEqual([]);
  });

  it('ordena un solo elemento', () => {
    expect(mergeSort([42])).toStrictEqual([42]);
  });

  it('mantiene un array ya ordenado', () => {
    expect(mergeSort([1, 2, 3, 4, 5])).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('ordena un array en orden inverso', () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('ordena arrays con duplicados', () => {
    expect(mergeSort([4, 1, 3, 4, 2, 1])).toStrictEqual([1, 1, 2, 3, 4, 4]);
  });

  it('ordena arrays con números negativos', () => {
    expect(mergeSort([3, -1, -5, 2, 0])).toStrictEqual([-5, -1, 0, 2, 3]);
  });

  it('ordena un array grande', () => {
    const largeArray = buildPseudoRandomArray(200);
    const sorted = mergeSort(largeArray);

    expect(sorted).toStrictEqual([...largeArray].sort((a, b) => a - b));
    expect(sorted.length).toBe(largeArray.length);
  });
});

describe('getMergeSortSteps', () => {
  it('incluye pasos de split y termina con un array completamente ordenado', () => {
    const input = [38, 27, 43, 3, 9, 82, 10];
    const steps = getMergeSortSteps(input);

    expect(steps[0]?.phase).toBe('split');
    const lastStep = steps.at(-1) as MergeSortStep;
    expect(lastStep.phase).toBe('merge');
    expect(lastStep.array).toStrictEqual([...input].sort((a, b) => a - b));
    expect(lastStep.description).toBe('Array totalmente ordenado.');
  });

  it('devuelve un único paso para arrays vacíos', () => {
    const steps = getMergeSortSteps([]);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      array: [],
      left: [],
      right: [],
      merged: [],
      phase: 'merge',
      description: 'Array vacío: no hay elementos para ordenar.',
    });
  });

  it('genera pasos de merge con arrays ordenados', () => {
    const steps = getMergeSortSteps([5, 2, 4]);

    const mergeSteps = steps.filter((step) => step.phase === 'merge');

    expect(mergeSteps.length).toBeGreaterThan(0);
    mergeSteps.forEach((step) => {
      const sortedMerge = [...step.merged].sort((a, b) => a - b);
      expect(step.merged).toStrictEqual(sortedMerge);
    });
  });
});
