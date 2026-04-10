import React from 'react';
import { mergeSort } from '../../algorithms/MergeSort';
import { resetColors } from '../../algorithms/common';
import Controls from '../../components/Controls/Controls';
import Item from '../../components/Item/Item';
import { useSorting } from '../../hooks/useSorting';
import './MergeSort.css';

const MergeSort: React.FC = () => {
  const initialStep = { array: resetColors([5, 3, 8, 4, 2, 7, 1, 6]) };
  const { steps, currentStep, handleSort } = useSorting(initialStep, mergeSort);

  return (
    <Controls onButtonClick={handleSort} text={'Merge Sort Visualization'}>
      {steps[currentStep].array.map((item) => (
        <Item key={item.value} text={item.value} color={item.color} />
      ))}
    </Controls>
  );
};

export default MergeSort;
