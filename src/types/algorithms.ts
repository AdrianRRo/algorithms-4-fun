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
    phase?: "build" | "extract";
    heapSize?: number;
    highlightedIndices?: number[];
    swapped?: [number, number];
    currentRoot?: number;
}

export interface MergeSortStep extends BaseStep {
    metadata?: StepMetadata & {
        stage: "split" | "merge" | "compare";
        subarrayDepth: number;
    };
}

export interface HeapSortStep extends BaseStep {
    metadata?: StepMetadata & {
        phase: "build" | "extract";
        heapSize: number;
        highlightedIndices: number[];
    };
}