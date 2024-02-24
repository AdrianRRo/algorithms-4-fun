import React from 'react';
import './Controls.css'

interface ControlsProps {
  text: string;
  onButtonClick: () => void;
  children: JSX.Element | JSX.Element[]
}

const Controls: React.FC<ControlsProps> = ({ text, onButtonClick, children }) => {
  return (
    <div>
      <h2>{text}</h2>
      <button onClick={onButtonClick}>Sort</button>
      <div className="controls-container">
        { children }
      </div>
    </div>
  );
};

export default Controls;
