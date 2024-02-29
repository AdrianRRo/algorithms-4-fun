import { BubbleStep } from "../types/algorithms";
import { swap } from "./common";

export const bubbleSort = (array: number[]): Array<BubbleStep> => {
    const len = array.length;
    const steps: Array<BubbleStep> = [];
    for (let i = 0; i < len; i++) {
      const remainingArrayLen = len - i - 1;
        for (let j = 0; j < remainingArrayLen; j++) {
          let isSwap = false;
          const left = array[j];
          const right = array[j + 1]
          steps.push({ array: [...array], leftValue: left , rightValue: right, solutionLength: len - remainingArrayLen})
            if ( left > right ) {
              swap(array, j, j + 1)
              isSwap = true;
              steps.push({ array: [...array] , leftValue: array[j] , rightValue: array[j + 1], isSwap, solutionLength: len - remainingArrayLen})
            }
        }
    }
    return steps;
  }