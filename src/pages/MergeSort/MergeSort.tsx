import React, { useEffect, useState } from 'react';
import {
  MergeSortStep,
  getMergeSortSteps,
} from '../../algorithms/MergeSort';
import './MergeSort.css';

const INITIAL_ARRAY = [38, 27, 43, 3, 9, 82, 10];
const MIN_SPEED = 200;
const MAX_SPEED = 1500;
const SPEED_STEP = 100;

const consumeValue = (queue: number[], value: number): boolean => {
  const index = queue.indexOf(value);

  if (index === -1) {
    return false;
  }

  queue.splice(index, 1);
  return true;
};

const formatList = (values: number[]): string =>
  values.length > 0 ? values.join(', ') : '∅';

const MergeSort: React.FC = () => {
  const [steps, setSteps] = useState<MergeSortStep[]>(() =>
    getMergeSortSteps(INITIAL_ARRAY),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }

        return prev + 1;
      });
    }, speed);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying, speed, steps.length]);

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps(getMergeSortSteps(INITIAL_ARRAY));
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }

    setIsPlaying(true);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(event.target.value));
  };

  const safeIndex = Math.min(currentStep, steps.length - 1);
  const step = steps[safeIndex];
  const leftQueue = [...step.left];
  const rightQueue = [...step.right];
  const mergedQueue = [...step.merged];
  const maxValue = Math.max(...INITIAL_ARRAY.map((value) => Math.abs(value)), 1);

  const getBarClassName = (value: number): string => {
    const classes = ['bar'];

    if (step.phase === 'merge' && consumeValue(mergedQueue, value)) {
      classes.push('bar--merged');
    }

    if (consumeValue(leftQueue, value)) {
      classes.push('bar--left');
    } else if (consumeValue(rightQueue, value)) {
      classes.push('bar--right');
    }

    return classes.join(' ');
  };

  return (
    <section className="merge-sort">
      <header className="merge-sort__header">
        <h2>Merge Sort Visualization</h2>
        <p>
          Paso {safeIndex + 1} / {steps.length} — Fase: {step.phase}
        </p>
      </header>

      <div className="merge-sort__controls">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={safeIndex === 0}
        >
          Paso anterior
        </button>
        <button
          type="button"
          onClick={handleTogglePlay}
          disabled={steps.length <= 1}
        >
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={safeIndex >= steps.length - 1}
        >
          Siguiente paso
        </button>
        <button type="button" onClick={handleReset}>
          Reiniciar
        </button>
      </div>

      <div className="merge-sort__speed">
        <label htmlFor="merge-sort-speed">
          Velocidad de animación: {speed} ms
        </label>
        <input
          id="merge-sort-speed"
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={SPEED_STEP}
          value={speed}
          onChange={handleSpeedChange}
        />
      </div>

      <div className="merge-sort__content">
        <div className="merge-sort__bars">
          {step.array.map((value, index) => {
            const barHeight = (Math.abs(value) / maxValue) * 220;
            const className = getBarClassName(value);
            return (
              <div
                key={`${value}-${index}-${safeIndex}`}
                className={className}
                style={{ height: `${barHeight}px` }}
              >
                <span className="bar__value">{value}</span>
              </div>
            );
          })}
        </div>

        <aside className="merge-sort__details">
          <h3>Detalles del paso</h3>
          <p className="merge-sort__description">{step.description}</p>
          <div className="merge-sort__table">
            <div>
              <h4>Left</h4>
              <p>{formatList(step.left)}</p>
            </div>
            <div>
              <h4>Right</h4>
              <p>{formatList(step.right)}</p>
            </div>
            <div>
              <h4>Merged</h4>
              <p>{formatList(step.merged)}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default MergeSort;
