import { Move } from '../types';

export type SavedGame = {
    gameId: string;
    date: string;
    moves: Move[];
    winningPlayer: 'black' | 'white' | null;
    boardSizeX: number;
    boardSizeY: number;
  };