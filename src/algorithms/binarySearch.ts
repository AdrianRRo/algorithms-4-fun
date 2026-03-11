/**
 * Binary search algorithm - finds the index of target in a sorted array.
 * Returns -1 if target is not found.
 *
 * @param sortedArray - A sorted array of numbers (ascending order)
 * @param target - The value to search for
 * @returns The index of target, or -1 if not found
 */
export const binarySearch = (sortedArray: number[], target: number): number => {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = sortedArray[mid];

    if (midValue === target) {
      return mid;
    }

    if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
};
