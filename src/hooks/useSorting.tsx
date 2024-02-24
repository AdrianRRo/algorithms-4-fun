import { useState } from 'react';
import { AnyStep } from '../types/algorithms';

export const useSorting = <T extends AnyStep>(
    initialState: T,
    sortingFunction: (array: number[]) => T[],
    timeBetweenSteps = 1000
) => {
  const [steps, setSteps] = useState<T[]>([initialState]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSort = () => {
    const sortedSteps = sortingFunction(initialState.array);
    setSteps(sortedSteps);
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep < sortedSteps.length - 1) {
          return prevStep + 1;
        } else {
          clearInterval(interval);
          return prevStep;
        }
      });
    }, timeBetweenSteps);
  };

  return { steps, currentStep, handleSort };
}
