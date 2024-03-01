import React from 'react';
import { resetColors } from '../../algorithms/common';
import { quickSort } from '../../algorithms/QuickSort';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import './QuickSort.css'

const QuickSort: React.FC = () => {
  const initialStep = { array: resetColors([5, 1, 8, 4, 2, 7, 3, 6])};
  const {steps, currentStep, handleSort} = useSorting(initialStep , quickSort )

  return (
    <Controls onButtonClick={handleSort} text={'Quick Sort Visualization'}>
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

export default QuickSort;
