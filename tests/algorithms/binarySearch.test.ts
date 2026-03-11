import { describe, it, expect } from 'vitest';
import { binarySearch } from '../../src/algorithms/binarySearch';

describe('binarySearch', () => {
  it('encuentra el elemento en el medio del array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(binarySearch(arr, 3)).toBe(2);
  });

  it('encuentra el elemento al inicio del array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(binarySearch(arr, 1)).toBe(0);
  });

  it('encuentra el elemento al final del array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(binarySearch(arr, 5)).toBe(4);
  });

  it('retorna -1 cuando el elemento no existe', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(binarySearch(arr, 6)).toBe(-1);
  });

  it('retorna -1 cuando el elemento es menor que el mínimo', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(binarySearch(arr, 0)).toBe(-1);
  });

  it('funciona con array de un solo elemento', () => {
    const arr = [42];
    expect(binarySearch(arr, 42)).toBe(0);
    expect(binarySearch(arr, 1)).toBe(-1);
  });

  it('funciona con array de dos elementos', () => {
    const arr = [1, 2];
    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 2)).toBe(1);
    expect(binarySearch(arr, 3)).toBe(-1);
  });

  it('funciona con array vacío', () => {
    const arr: number[] = [];
    expect(binarySearch(arr, 1)).toBe(-1);
  });

  it('funciona con array de muchos elementos', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i + 1);
    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 50)).toBe(49);
    expect(binarySearch(arr, 100)).toBe(99);
    expect(binarySearch(arr, 101)).toBe(-1);
  });
});
