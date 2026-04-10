import { useState } from 'react';
import { PathfindingStep } from '../types/pathfinding';

type PathfindingAlgorithm = () => PathfindingStep[];

export const usePathfinding = (
  initialStep: PathfindingStep,
  pathfindingFunction: PathfindingAlgorithm,
  timeBetweenSteps = 500,
) => {
  const [steps, setSteps] = useState<PathfindingStep[]>([initialStep]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSearch = () => {
    const computedSteps = pathfindingFunction();

    if (computedSteps.length === 0) {
      setSteps([initialStep]);
      setCurrentStep(0);
      return;
    }

    setSteps(computedSteps);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((previousStep) => {
        if (previousStep < computedSteps.length - 1) {
          return previousStep + 1;
        }
        clearInterval(interval);
        return previousStep;
      });
    }, timeBetweenSteps);
  };

  return { steps, currentStep, handleSearch };
};
