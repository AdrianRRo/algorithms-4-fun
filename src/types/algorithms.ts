import { StepColors } from "./colors";

export interface Item {
    value: number;
    color: StepColors;
}

export interface BaseStep {
    array: Item[];
    metadata?: StepMetadata;
}

export interface StepMetadata {
    stage?: "split" | "merge" | "compare" | "idle";
    description?: string;
    focusRange?: { start: number; end: number };
    leftBuffer?: Item[];
    rightBuffer?: Item[];
    mergedBuffer?: Item[];
}

export interface MergeSortStep extends BaseStep {
    metadata?: StepMetadata & {
        stage: "split" | "merge" | "compare";
        subarrayDepth: number;
    };
}