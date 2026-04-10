import React from 'react';
import './PathfindingGrid.css';

type CellState = 'empty' | 'wall' | 'start' | 'goal' | 'open' | 'closed' | 'path' | 'current';

const CELL_CLASS_MAP: Record<CellState, string> = {
  empty: 'pathfinding-grid__cell--empty',
  wall: 'pathfinding-grid__cell--wall',
  start: 'pathfinding-grid__cell--start',
  goal: 'pathfinding-grid__cell--goal',
  open: 'pathfinding-grid__cell--open',
  closed: 'pathfinding-grid__cell--closed',
  path: 'pathfinding-grid__cell--path',
  current: 'pathfinding-grid__cell--current',
};

const CELL_LABEL_MAP: Partial<Record<CellState, string>> = {
  start: 'S',
  goal: 'G',
};

interface PathfindingGridProps {
  grid: CellState[][];
  description?: string;
}

const PathfindingGrid: React.FC<PathfindingGridProps> = ({ grid, description }) => {
  return (
    <div className="pathfinding-grid__wrapper">
      {description && <p className="pathfinding-grid__description">{description}</p>}
      <div className="pathfinding-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pathfinding-grid__row">
            {row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const label = CELL_LABEL_MAP[cell];

              return (
                <div
                  key={key}
                  className={`pathfinding-grid__cell ${CELL_CLASS_MAP[cell]}`}
                  aria-label={`${cell} cell`}
                >
                  {label ?? ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathfindingGrid;
