import { InsertionStep } from "../types/algorithms";

export const insertionSort = (array: number[]): InsertionStep[] => {
    const len = array.length;
    const steps: InsertionStep[] = [];
    for(let i = 1; i < len; i++) {
      let key = array[i];
      let j = i - 1;
      steps.push({ array: [...array], sorting: key, sortedIndex: i })
      while(j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        array[j] = key;
        steps.push({ array: [...array], sorting: key, sortedIndex: i })
        j = j - 1;
      }
    }
    return steps;
  }