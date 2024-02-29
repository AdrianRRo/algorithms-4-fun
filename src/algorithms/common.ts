export const swap = (array: number[], leftIndex: number, rightIndex: number) => {
    const { leftValue, rightValue }  = { leftValue: array[leftIndex], rightValue: array[rightIndex] };
    array[leftIndex] = rightValue;
    array[rightIndex] = leftValue;
    return array;
}