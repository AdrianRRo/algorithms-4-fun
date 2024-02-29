import { SelectionStep } from "../types/algorithms";
import { swap } from "./common";

export const selectionSort = (array: number[]): SelectionStep[] => {
    const len = array.length;
    const steps: SelectionStep[] = [];
    for( let i = 0; i < len; i++) {
      let biggestValueIndex = 0;
      const remainingArrayLen = len - i - 1;
      steps.push({ array: [...array], sorting: array[biggestValueIndex], sortedIndex: remainingArrayLen, isSwap: false, biggestValue: array[0] })
      for(let j = 1; j <= remainingArrayLen; j++) {
        steps.push({ array: [...array], sorting: array[j], sortedIndex: remainingArrayLen, isSwap: false, biggestValue: array[biggestValueIndex]})
        if(array[biggestValueIndex] < array[j]) {
          biggestValueIndex = j;
        }
      }
      if(biggestValueIndex !== remainingArrayLen) {
        swap(array, biggestValueIndex, remainingArrayLen)
        steps.push({ array: [...array], sorting: array[biggestValueIndex], sortedIndex: remainingArrayLen, isSwap: true, biggestValue: array[remainingArrayLen] })
      }
    }
    console.log(steps);
    return steps;
  }