import React from 'react';
import './Controls.css';

interface ControlsProps {
  text: string;
  onButtonClick: () => void;
  children: React.ReactNode;
  buttonLabel?: string;
}

const Controls: React.FC<ControlsProps> = ({ text, onButtonClick, children, buttonLabel = 'Sort' }) => {
  return (
    <div>
      <h2>{text}</h2>
      <button onClick={onButtonClick}>{buttonLabel}</button>
      <div className="controls-container">
        {children}
      </div>
    </div>
  );
};

export default Controls;
