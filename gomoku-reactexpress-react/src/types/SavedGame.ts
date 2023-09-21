import { Move } from '../types';

export type SavedGame = {
    _id: string;
    createdAt: Date;  // Replacing date with createdAt
    moves: Move[];
    winningPlayer: 'black' | 'white' | 'draw' | "none" | 'unfinished'; // Added 'unfinished' based on your previous logic in Games.tsx
    boardSizeX: number;
    boardSizeY: number;
    status: 'winner' | 'draw' | 'continue' | 'unfinished';
};
