import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

  export const quickSortRegression = (initialArray: Item[], steps: BaseStep[], initial: number, end: number): Item[] => {
    if(end - initial <= 0) {
        return initialArray;
    } else {
        const pivotIndex = Math.floor((end - initial) / 2) + initial;
        const pivot = initialArray[pivotIndex].value;
        const nonUsedItems = [];
        for(let i = 0; i < initialArray.length; i++) {
            if(i < initial || i > end) {
                nonUsedItems.push({value: initialArray[i].value, color: StepColors.DISABLED})
            }
        }

        initialArray = setColors(initialArray, [ 
            ...nonUsedItems
           ], 0,
           0);
        steps.push({ array: [...initialArray] })

        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.PIVOT },
            ...nonUsedItems
           ], 0,
           0);
        steps.push({ array: [...initialArray] })

        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.SWAP },
            { value: initialArray[end].value, color: StepColors.SWAP },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })

        swap(initialArray, pivotIndex, end);

        initialArray = setColors(initialArray, [ 
            { value: initialArray[pivotIndex].value, color: StepColors.SWAP },
            { value: pivot, color: StepColors.SWAP },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })
        
        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.PIVOT },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })

        const minorItemValues: Item[] = [];
        const majorItemValues: Item[] = [];
        
        for (let i = initial; i < end; i++) {
            if (initialArray[i].value < pivot) {
                minorItemValues.push(initialArray[i]);
                initialArray = setColors(initialArray, [ 
                    { value: initialArray[i].value, color: StepColors.HANDLING },
                    { value: pivot, color: StepColors.PIVOT },
                    ...nonUsedItems
                   ], 0,
                   0, true);
                steps.push({ array: [...initialArray] })
            } else {
                majorItemValues.push(initialArray[i]);
                initialArray = setColors(initialArray, [ 
                    { value: initialArray[i].value, color: StepColors.SWAP },
                    { value: pivot, color: StepColors.PIVOT },
                    ...nonUsedItems
                   ], 0,
                   0, true);
                steps.push({ array: [...initialArray] })
            }
        }

        const minorColoredSteps: Item[] = minorItemValues.map((item) => { 
            return {value: item.value, color: StepColors.HANDLING};
         })
        const majorColoredSteps = majorItemValues.map((item) => { 
            return {value: item.value, color: StepColors.SWAP};
        })

        const auxArray = [...minorColoredSteps, {value: pivot, color: StepColors.PIVOT }, ...majorColoredSteps];
        initialArray.splice(initial, (end + 1) - initial, ...auxArray);
        steps.push({ array: [...initialArray] })

        let result = [
            ...quickSortRegression(initialArray, steps, initial, initialArray.findIndex((item) => item.value === pivot) - 1), 
            {value: pivot, color: StepColors.DEFAULT }, 
            ...quickSortRegression(initialArray, steps, pivotIndex + initial + 1, end)];
        return result;
    }
  }

  export const quickSort = (array: Item[]): BaseStep[] => {
    const steps: BaseStep[] = [];
    quickSortRegression(array, steps, 0, array.length - 1);
    const auxArray = steps[steps.length-1].array.map((item) => ({value: item.value, color: item.color}))
    steps.push({array: setColors(auxArray, [], -1, auxArray.length - 1)})
    return steps;
  }
