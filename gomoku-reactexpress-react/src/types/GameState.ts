import { Move } from '../types'

export interface GameState {
    board: ('grey' | 'black' | 'white')[][];
    currentPlayer: 'black' | 'white';
    moves: Move[]; // Add an array to store the moves
    currentMoveNumber: number; // Add this field
  }