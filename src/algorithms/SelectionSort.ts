import { Item, BaseStep } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

export const selectionSort = (initialArray: Item[]): BaseStep[] => {
  let array = [...initialArray];
    const len = array.length;
    const steps: BaseStep[] = [];
    for( let i = 0; i < len; i++) {
      let biggestValueIndex = 0;
      const remainingArrayLen = len - i - 1;
      array = setColors(array, [ 
        { value: array[biggestValueIndex].value, color: StepColors.HANDLING },
        { value: array[0].value, color: StepColors.SWAP }
       ], remainingArrayLen,
       array.length - 1)
      steps.push({ array: [...array] })
      for(let j = 1; j <= remainingArrayLen; j++) {
        array = setColors(array, [ 
          { value: array[j].value, color: StepColors.HANDLING },
          { value: array[biggestValueIndex].value, color: StepColors.SWAP }
         ], remainingArrayLen,
         array.length - 1)
        steps.push({ array: [...array] })
        if(array[biggestValueIndex].value < array[j].value) {
          biggestValueIndex = j;
        }
      }
      if(biggestValueIndex !== remainingArrayLen) {
        swap(array, biggestValueIndex, remainingArrayLen);
        array = setColors(array, [ 
          { value: array[biggestValueIndex].value, color: StepColors.SWAP },
          { value: array[remainingArrayLen].value, color: StepColors.SWAP }
         ], remainingArrayLen,
         array.length - 1)
        steps.push({ array: [...array] })
      }
    }
    return steps;
  }