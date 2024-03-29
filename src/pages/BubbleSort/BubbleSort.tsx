import React from 'react';
import { bubbleSort } from '../../algorithms/BubbleSort';
import { resetColors } from '../../algorithms/common';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import './BubbleSort.css'

const BubbleSort: React.FC = () => {
  let initialStep = { array: resetColors([5, 3, 8, 4, 2, 7, 1, 6])};
  const {steps, currentStep, handleSort} = useSorting(initialStep, bubbleSort)
  return (
    <Controls onButtonClick={handleSort} text={'Bubble Sort Visualization'}>
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

export default BubbleSort;
