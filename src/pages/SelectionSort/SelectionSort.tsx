import React from 'react';
import { selectionSort } from '../../algorithms/SelectionSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import { SelectionStep } from '../../types/algorithms';
import { StepColors } from '../../types/colors';
import './SelectionSort.css'

const SelectionSort: React.FC = () => {
  const array = [5, 3, 8, 4, 2, 7, 1, 6];
  const {steps, currentStep, handleSort} = useSorting<SelectionStep>({array, sorting: array[0], sortedIndex: array.length, isSwap: false, biggestValue: array[0]}, selectionSort )

  return (
    <Controls onButtonClick={handleSort} text={'Selectiontion Sort Visualization'}>
      {steps[currentStep].array.map((value, index) => (
          <Item 
            key={value} 
            text={value} 
            color={steps[currentStep].isSwap && (value === steps[currentStep].sorting || value === steps[currentStep].biggestValue) ? StepColors.SWAP : value === steps[currentStep].sorting ? StepColors.HANDLING : index > steps[currentStep].sortedIndex ? StepColors.HANDLED : steps[currentStep].biggestValue === value ? StepColors.SWAP : StepColors.DEFAULT}
          />
        ))}
    </Controls>
  );
};

export default SelectionSort;
