import React from 'react';
import { resetColors } from '../../algorithms/common';
import { insertionSort } from '../../algorithms/InsertionSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import './InsertionSort.css'

const InsertionSort: React.FC = () => {
  let initialStep = { array: resetColors([5, 3, 8, 4, 2, 7, 1, 6])};
  const {steps, currentStep, handleSort} = useSorting(initialStep, insertionSort)

  return (
    <Controls onButtonClick={handleSort} text={'Insertion Sort Visualization'}>
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

export default InsertionSort;
