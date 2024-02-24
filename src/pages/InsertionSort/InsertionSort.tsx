import React from 'react';
import { insertionSort } from '../../algorithms/InsertionSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import { InsertionStep } from '../../types/algorithms';
import { StepColors } from '../../types/colors';
import './InsertionSort.css'

const InsertionSort: React.FC = () => {
  const array = [5, 3, 8, 4, 2, 7, 1, 6];
  const {steps, currentStep, handleSort} = useSorting<InsertionStep>({array, sorting: 3, sortedIndex: 1}, insertionSort)

  return (
    <Controls onButtonClick={handleSort} text={'Insertion Sort Visualization'}>
      {steps[currentStep].array.map((value, index) => (
          <Item 
            key={index} 
            text={value} 
            color={value === steps[currentStep].sorting ? StepColors.HANDLING : index <= steps[currentStep].sortedIndex ? StepColors.HANDLED : StepColors.DEFAULT}
          />
        ))}
    </Controls>
  );
};

export default InsertionSort;
