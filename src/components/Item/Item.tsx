import React from 'react';
import { StepColors } from '../../types/colors';
import './Item.css'

interface ItemProps {
    color: StepColors;
    text: number
}

const Item: React.FC<ItemProps> = ({ text, color }: ItemProps) => {
  return (
        <div
            className="item"
            style={{ backgroundColor: color }}
        >
            {text}
        </div>
  );
};

export default Item;
