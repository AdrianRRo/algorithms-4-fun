import React from 'react';
import { resetColors } from '../../algorithms/common';
import { selectionSort } from '../../algorithms/SelectionSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import './SelectionSort.css'

const SelectionSort: React.FC = () => {
  const initialStep = { array: resetColors([5, 3, 8, 4, 2, 7, 1, 6])};
  const {steps, currentStep, handleSort} = useSorting(initialStep , selectionSort )

  return (
    <Controls onButtonClick={handleSort} text={'Selectiontion Sort Visualization'}>
      {steps[currentStep].array.map((item) => (
          <Item 
            key={item.value} 
            text={item.value} 
            color={item.color}
          />
        ))}
    </Controls>
  );
};

export default SelectionSort;
