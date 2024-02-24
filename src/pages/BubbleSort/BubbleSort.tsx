import React from 'react';
import { bubbleSort } from '../../algorithms/BubbleSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import { BubbleStep } from '../../types/algorithms';
import { StepColors } from '../../types/colors';
import './BubbleSort.css'

const BubbleSort: React.FC = () => {
  const array = [5, 3, 8, 4, 2, 7, 1, 6];
  const {steps, currentStep, handleSort} = useSorting<BubbleStep>({array, leftValue: array[0], rightValue: array[1], solutionLength: 0}, bubbleSort)
  return (
    <Controls onButtonClick={handleSort} text={'Bubble Sort Visualization'}>
      {steps[currentStep].array.map((value, index) => (
          <Item
            key={index}
            text={value}
            color={(steps[currentStep].leftValue === value || steps[currentStep].rightValue === value) ? steps[currentStep].isSwap ? StepColors.SWAP : StepColors.HANDLING : (index > (steps[currentStep].array.length - steps[currentStep].solutionLength)) ? StepColors.HANDLED : StepColors.DEFAULT}
          />
        ))}
    </Controls>
  );
};

export default BubbleSort;
