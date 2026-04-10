import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { resetColors } from "./common";

const cloneItems = (items: Item[]): Item[] =>
  items.map((item) => ({ value: item.value, color: item.color }));

const mergeStep = (
  array: Item[],
  left: number,
  mid: number,
  right: number,
  steps: BaseStep[]
): void => {
  const leftArr = array.slice(left, mid + 1).map((item) => item.value);
  const rightArr = array.slice(mid + 1, right + 1).map((item) => item.value);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftArr.length && j < rightArr.length) {
    // Highlight the two elements being compared
    array[left + i].color = StepColors.HANDLING;
    array[mid + 1 + j].color = StepColors.HANDLING;
    steps.push({ array: cloneItems(array) });

    if (leftArr[i] <= rightArr[j]) {
      array[k] = { value: leftArr[i], color: StepColors.SWAP };
      i++;
    } else {
      array[k] = { value: rightArr[j], color: StepColors.SWAP };
      j++;
    }
    steps.push({ array: cloneItems(array) });

    // Reset color of placed element
    array[k].color = StepColors.DEFAULT;
    k++;
  }

  while (i < leftArr.length) {
    array[k] = { value: leftArr[i], color: StepColors.SWAP };
    steps.push({ array: cloneItems(array) });
    array[k].color = StepColors.DEFAULT;
    i++;
    k++;
  }

  while (j < rightArr.length) {
    array[k] = { value: rightArr[j], color: StepColors.SWAP };
    steps.push({ array: cloneItems(array) });
    array[k].color = StepColors.DEFAULT;
    j++;
    k++;
  }
};

const mergeSortRecursive = (
  array: Item[],
  left: number,
  right: number,
  steps: BaseStep[]
): void => {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergeSortRecursive(array, left, mid, steps);
  mergeSortRecursive(array, mid + 1, right, steps);
  mergeStep(array, left, mid, right, steps);
};

export const mergeSort = (array: Item[]): BaseStep[] => {
  const workingArray = resetColors(array);
  const steps: BaseStep[] = [{ array: cloneItems(workingArray) }];

  mergeSortRecursive(workingArray, 0, workingArray.length - 1, steps);

  return steps;
};
