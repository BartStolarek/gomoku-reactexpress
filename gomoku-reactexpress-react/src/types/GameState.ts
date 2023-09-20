import { Move } from '../types'

export interface GameState {
    board: ('grey' | 'black' | 'white')[][];
    currentPlayer: 'black' | 'white';
    currentMoveNumber: number; // Add this field
  }