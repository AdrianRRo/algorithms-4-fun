interface BaseStep {
    array: number[];
}

export interface BubbleStep extends BaseStep {
    leftValue: number, 
    rightValue: number, 
    isSwap?: boolean, 
    solutionLength: number
}

export interface InsertionStep extends BaseStep {
    sorting: number, 
    sortedIndex: number
}

export type AnyStep = BubbleStep | InsertionStep;