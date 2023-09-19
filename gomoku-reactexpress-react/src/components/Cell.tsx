import { memo } from 'react';
import { Player } from '../types';

import style from './Cell.module.css';

// Cell component props
type CellProps = {
  x: number;
  y: number;
  occupied: boolean;
  player?: Player;
  onClick?: (x: number, y: number) => void;
  moveId?: number;  // Add this line
};

// Helper function to get the class names for the cell
const getClassNames = (occupied: boolean, player?: Player) => {
  const className = style.cell;
  if (occupied) {
    if (player?.name === 'black') {
      return `${className} ${style.black}`;
    } else {
      return `${className} ${style.white}`;
    }
  } else {
    return `${className} ${style.grey}`;
  }
};

// Cell component
export default memo(function Cell(props: CellProps) {
  const { x, y, occupied = false, player, moveId } = props;  // Destructure moveId
  const { onClick } = props;

  // Internal click handler
  const internalHandleClick = () => {
    // Call the onClick handler passed from the parent with coordinates
    if (onClick) onClick(x, y);
  };

  return (
    <div
      className={getClassNames(occupied, player)}
      onClick={internalHandleClick}
    >
      {moveId && <span className={style.moveId}>{moveId}</span>} 
    </div>
  );
});
