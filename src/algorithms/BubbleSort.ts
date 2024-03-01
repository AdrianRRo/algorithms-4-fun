import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

export const bubbleSort = (array: Item[]): Array<BaseStep> => {
    const len = array.length;
    const steps: Array<BaseStep> = [];
    for (let i = 0; i < len; i++) {
      const remainingArrayLen = len - i - 1;
        for (let j = 0; j < remainingArrayLen; j++) {
          const left = array[j].value;
          const right = array[j + 1].value
          array = setColors(array, [ 
            { value: left, color: StepColors.HANDLING },
            { value: right, color: StepColors.HANDLING }
           ], remainingArrayLen,
           array.length - 1)
          steps.push({ array: [...array] })
            if ( left > right ) {
              swap(array, j, j + 1);
              array = setColors(array, [ 
                { value: array[j].value, color: StepColors.SWAP },
                { value: array[j + 1].value, color: StepColors.SWAP }
               ], remainingArrayLen,
               array.length - 1)
              steps.push({ array: [...array] })
            }
        }
    }
    return steps;
  }