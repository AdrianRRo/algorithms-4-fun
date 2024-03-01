import { useState } from 'react';
import { BaseStep, Item } from '../types/algorithms';

export const useSorting = (
    initialState: BaseStep,
    sortingFunction: (array: Item[]) => BaseStep[],
    timeBetweenSteps = 1000
) => {
  const [steps, setSteps] = useState<BaseStep[]>([initialState]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSort = () => {
    const sortedSteps = sortingFunction(initialState.array);
    // poner timer y devolverlo para comparar tiempos
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
