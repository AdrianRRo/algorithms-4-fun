import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

const cloneItems = (items: Item[]): Item[] =>
  items.map((item) => ({ value: item.value, color: item.color }));

const arraysMatch = (left: Item[], right: Item[]): boolean =>
  left.length === right.length &&
  left.every(
    (item, index) =>
      item.value === right[index].value && item.color === right[index].color,
  );

export const mergeSort = (array: Item[]): BaseStep[] => {
  let workingArray = cloneItems(array);
  const steps: BaseStep[] = [];

  const pushStep = () => {
    const snapshot = cloneItems(workingArray);
    const lastStep = steps[steps.length - 1];

    if (!lastStep || !arraysMatch(lastStep.array, snapshot)) {
      steps.push({ array: snapshot });
    }
  };

  const recordComparison = (
    start: number,
    current: number,
    coloredItems: Item[],
  ) => {
    workingArray = setColors(workingArray, coloredItems, start - 1, current - 1, true);
    pushStep();
  };

  const placeValue = (start: number, current: number, value: number) => {
    workingArray[current] = { value, color: StepColors.SWAP };
    swap(workingArray, current, current);
    pushStep();
    workingArray = setColors(workingArray, [], start - 1, current, true);
    pushStep();
  };

  const merge = (start: number, mid: number, end: number) => {
    const buffer = cloneItems(workingArray.slice(start, end + 1)).map((item) => ({
      value: item.value,
      color: StepColors.DEFAULT,
    }));

    let left = 0;
    let right = mid - start + 1;
    let current = start;
    const leftLimit = mid - start;
    const rightLimit = end - start;

    while (left <= leftLimit && right <= rightLimit) {
      const leftItem = buffer[left];
      const rightItem = buffer[right];

      recordComparison(start, current, [
        { value: leftItem.value, color: StepColors.HANDLING },
        { value: rightItem.value, color: StepColors.HANDLING },
      ]);

      if (leftItem.value <= rightItem.value) {
        placeValue(start, current, leftItem.value);
        left += 1;
      } else {
        placeValue(start, current, rightItem.value);
        right += 1;
      }

      current += 1;
    }

    while (left <= leftLimit) {
      const buffered = buffer[left];
      recordComparison(start, current, [
        { value: buffered.value, color: StepColors.HANDLING },
      ]);
      placeValue(start, current, buffered.value);
      left += 1;
      current += 1;
    }

    while (right <= rightLimit) {
      const buffered = buffer[right];
      recordComparison(start, current, [
        { value: buffered.value, color: StepColors.HANDLING },
      ]);
      placeValue(start, current, buffered.value);
      right += 1;
      current += 1;
    }

    workingArray = setColors(workingArray, [], start - 1, end, true);
    pushStep();
  };

  const mergeSortRecursive = (start: number, end: number): void => {
    if (start >= end) {
      return;
    }

    const mid = Math.floor((start + end) / 2);
    mergeSortRecursive(start, mid);
    mergeSortRecursive(mid + 1, end);
    merge(start, mid, end);
  };

  if (workingArray.length === 0) {
    steps.push({ array: [] });
    return steps;
  }

  workingArray = setColors(workingArray, [], -1, -1);
  pushStep();
  mergeSortRecursive(0, workingArray.length - 1);

  workingArray = setColors(workingArray, [], -1, workingArray.length - 1);
  pushStep();

  return steps;
};
