export type MergeSortStep = {
  array: number[];
  left: number[];
  right: number[];
  merged: number[];
  phase: 'split' | 'merge';
  description: string;
};

export const merge = (left: number[], right: number[]): number[] => {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      merged.push(left[leftIndex]);
      leftIndex += 1;
    } else {
      merged.push(right[rightIndex]);
      rightIndex += 1;
    }
  }

  while (leftIndex < left.length) {
    merged.push(left[leftIndex]);
    leftIndex += 1;
  }

  while (rightIndex < right.length) {
    merged.push(right[rightIndex]);
    rightIndex += 1;
  }

  return merged;
};

export const mergeSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr.slice();
  }

  const divide = (subArray: number[]): number[] => {
    if (subArray.length <= 1) {
      return subArray.slice();
    }

    const mid = Math.floor(subArray.length / 2);
    const leftSorted = divide(subArray.slice(0, mid));
    const rightSorted = divide(subArray.slice(mid));

    return merge(leftSorted, rightSorted);
  };

  return divide(arr.slice());
};

export const getMergeSortSteps = (arr: number[]): MergeSortStep[] => {
  if (arr.length === 0) {
    return [
      {
        array: [],
        left: [],
        right: [],
        merged: [],
        phase: 'merge',
        description: 'Array vacío: no hay elementos para ordenar.',
      },
    ];
  }

  const steps: MergeSortStep[] = [];

  const divide = (subArray: number[]): number[] => {
    if (subArray.length <= 1) {
      steps.push({
        array: subArray.slice(),
        left: [],
        right: [],
        merged: subArray.slice(),
        phase: 'merge',
        description: 'Subarray de un elemento: no se divide.',
      });
      return subArray.slice();
    }

    const mid = Math.floor(subArray.length / 2);
    const left = subArray.slice(0, mid);
    const right = subArray.slice(mid);

    steps.push({
      array: subArray.slice(),
      left: left.slice(),
      right: right.slice(),
      merged: [],
      phase: 'split',
      description: `Dividiendo el subarray [${subArray.join(', ')}] en [${left.join(', ')}] y [${right.join(', ')}].`,
    });

    const sortedLeft = divide(left);
    const sortedRight = divide(right);
    const merged = merge(sortedLeft, sortedRight);

    steps.push({
      array: merged.slice(),
      left: sortedLeft.slice(),
      right: sortedRight.slice(),
      merged: merged.slice(),
      phase: 'merge',
      description: `Fusionando [${sortedLeft.join(', ')}] y [${sortedRight.join(', ')}] en [${merged.join(', ')}].`,
    });

    return merged;
  };

  const sorted = divide(arr.slice());

  steps.push({
    array: sorted.slice(),
    left: [],
    right: [],
    merged: sorted.slice(),
    phase: 'merge',
    description: 'Array totalmente ordenado.',
  });

  return steps;
};
