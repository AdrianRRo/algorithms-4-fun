import { describe, it, expect } from 'vitest';
import { mergeSort } from '../../src/algorithms/MergeSort';
import { resetColors } from '../../src/algorithms/common';

describe('mergeSort', () => {
  it('ordena un array básico', () => {
    const items = resetColors([5, 3, 8, 4, 2, 7, 1, 6]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('ordena un array ya ordenado', () => {
    const items = resetColors([1, 2, 3, 4, 5]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([1, 2, 3, 4, 5]);
  });

  it('ordena un array en orden inverso', () => {
    const items = resetColors([5, 4, 3, 2, 1]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([1, 2, 3, 4, 5]);
  });

  it('ordena un array con duplicados', () => {
    const items = resetColors([3, 1, 4, 1, 5, 9, 2, 6, 5]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([1, 1, 2, 3, 4, 5, 5, 6, 9]);
  });

  it('maneja un array de un solo elemento', () => {
    const items = resetColors([42]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([42]);
  });

  it('maneja un array con todos los elementos iguales', () => {
    const items = resetColors([7, 7, 7, 7]);
    const steps = mergeSort(items);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array.map(i => i.value)).toEqual([7, 7, 7, 7]);
  });

  it('genera al menos un step', () => {
    const items = resetColors([3, 1, 2]);
    const steps = mergeSort(items);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('cada step contiene un array con el mismo número de elementos', () => {
    const items = resetColors([5, 3, 8, 4, 2]);
    const steps = mergeSort(items);
    steps.forEach(step => {
      expect(step.array.length).toBe(5);
    });
  });
});
