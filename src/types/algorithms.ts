import { StepColors } from "./colors";

export interface Item {
    value: number,
    color: StepColors
}

export interface BaseStep {
    array: Item[];
}