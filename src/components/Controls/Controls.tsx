import React, { ReactNode } from 'react';
import './Controls.css'

interface ControlsProps {
  text: string;
  onButtonClick: () => void;
  buttonLabel?: string;
  children: ReactNode;
}

const Controls: React.FC<ControlsProps> = ({ text, onButtonClick, buttonLabel = 'Sort', children }) => {
  return (
    <div>
      <h2>{text}</h2>
      <button onClick={onButtonClick}>{buttonLabel}</button>
      <div className="controls-container">
        { children }
      </div>
    </div>
  );
};

export default Controls;
