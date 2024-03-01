import { BaseStep, Item } from "../types/algorithms";
import { StepColors } from "../types/colors";
import { setColors, swap } from "./common";

  export const quickSortRegression = (array: Item[], steps: BaseStep[], initialArray: Item[], initial: number, end: number): Item[] => {
    const len = array.length;
    if (len <= 1) {
        return array;
    } else {
        const pivotIndex = Math.floor((array.length - 1) / 2);
        const pivot = array[pivotIndex].value;

        // Pintar de gris los que esten fuera del array que estoy contemplando
        const nonUsedItems = [];
        for(let i = 0; i < initialArray.length; i++) {
            if(i < initial || i > end) {
                nonUsedItems.push({value: initialArray[i].value, color: StepColors.DISABLED})
            }
        }

        // Set pivot color and nonUsedItems
        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.PIVOT },
            ...nonUsedItems
           ], 0,
           0);
        steps.push({ array: [...initialArray] })

        // Set pivot change with last element
        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.SWAP },
            { value: initialArray[end].value, color: StepColors.SWAP },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })

        // Swap elements in both arrays
        swap(array, pivotIndex, array.length - 1);
        swap(initialArray, pivotIndex + initial, (array.length - 1) + initial);
        // Show SWAP
        initialArray = setColors(initialArray, [ 
            { value: initialArray[pivotIndex + initial].value, color: StepColors.SWAP },
            { value: pivot, color: StepColors.SWAP },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })
        
        // Show only Pivot and nunUsedItems again (this time pivot is in last position)
        initialArray = setColors(initialArray, [ 
            { value: pivot, color: StepColors.PIVOT },
            ...nonUsedItems
            ], 0,
            0);
        steps.push({ array: [...initialArray] })
        
        const minorItemValues: Item[] = [];
        const majorItemValues: Item[] = [];
        
        // Find minor and majors items and color them
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i].value < pivot) {
                minorItemValues.push(array[i]);
                initialArray = setColors(initialArray, [ 
                    { value: initialArray[i + initial].value, color: StepColors.HANDLING },
                    { value: pivot, color: StepColors.PIVOT },
                    ...nonUsedItems
                   ], 0,
                   0, true);
                steps.push({ array: [...initialArray] })
            } else {
                majorItemValues.push(array[i]);
                initialArray = setColors(initialArray, [ 
                    { value: initialArray[i + initial].value, color: StepColors.SWAP },
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
            ...quickSortRegression(minorItemValues, steps, initialArray, initial, initialArray.findIndex((item) => item.value === pivot) - 1), 
            {value: pivot, color: StepColors.DEFAULT }, 
            ...quickSortRegression(majorItemValues, steps, initialArray, pivotIndex + initial + 1, end)];
        return result;
    }
  }

  export const quickSort = (array: Item[]): BaseStep[] => {
    const steps: BaseStep[] = [];
    const result = quickSortRegression(array, steps, array.map((item) => { return {value: item.value, color: item.color}}), 0, array.length - 1);
    steps.push({array: setColors(result, [], -1, result.length - 1)})
    return steps;
  }
