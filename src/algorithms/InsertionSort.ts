import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

export const insertionSort = (array: Item[]): BaseStep[] => {
    const len = array.length;
    const steps: BaseStep[] = [];
    for(let i = 1; i < len; i++) {
      let key = array[i].value;
      let j = i - 1;
      array = setColors(array, [ 
        { value: array[i].value, color: StepColors.HANDLING },
       ], -1,
       i);
      steps.push({ array: [...array] })
      while(j >= 0 && array[j].value > key) {
        swap(array, j, j + 1);
        array = setColors(array, [ 
          { value: array[j].value, color: StepColors.HANDLING },
         ], -1,
         i);
        steps.push({ array: [...array] })
        j = j - 1;
      }
    }
    return steps;
  }