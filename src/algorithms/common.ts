import { Item } from "../types/algorithms";
import { StepColors } from "../types/colors";

export const swap = (array: Item[], leftIndex: number, rightIndex: number) => {
    const { leftItem, rightItem }  = { leftItem: array[leftIndex], rightItem: array[rightIndex] };
    array[leftIndex] = rightItem;
    array[rightIndex] = leftItem;
    return array;
}

export const resetColors = (array: Item[] | number[], notErase?: boolean): Item[] => {
    const newArray: Item[] =  array.map((item: Item | number) => {
        if(typeof item === 'number') {
            return { value: item, color: StepColors.DEFAULT };
        } else {
            return { value: item.value, color: notErase ? item.color : StepColors.DEFAULT };
        }
    });
    return newArray;
}

export const setColors = (
    initialArray: Item[], 
    coloredItems: Item[], 
    resultsInitialIndex: number, 
    resultsFinalIndex: number,
    notErase?: boolean,
): Item[] => {
    let array = resetColors(initialArray, notErase);
    array = resultsInitialIndex !== resultsFinalIndex ? setResultColors(array, resultsInitialIndex, resultsFinalIndex) : array; 

    for(let i = 0; i < coloredItems.length; i++) {
        const { value, color } = coloredItems[i];
        const colorItemIndex = array.findIndex((item) => item.value === value )
        array[colorItemIndex].color = color;
    }
    return array;
}

export const setResultColors = (
    initialArray: Item[], 
    initialIndex: number, 
    finalIndex: number
): Item[] => {
    return initialArray.map((item, index) => {
        if(index > initialIndex && index <= finalIndex) {
            item.color = StepColors.HANDLED;
        }
        return { value: item.value, color: item.color };
    })
}