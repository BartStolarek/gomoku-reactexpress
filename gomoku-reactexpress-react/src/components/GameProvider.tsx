import { useState } from 'react';
import GameContext from '../context/GameContext';

// Assigning the children prop to a variable called children
type GameProviderProps = {
  children: React.ReactNode;
};

// This is the provider that will wrap the entire application so that game board size can be passed around
export default function GameProvider({ children }: GameProviderProps) {
  const [gameId, setGameId] = useState<string>(""); // This will be used to store the game id from the backend
  const [boardSizeX, setX] = useState<number>(15);
  const [boardSizeY, setY] = useState<number>(15);

  // These functions will be used to update the board size

  const updateGameId = (id: string) => {
    setGameId(id);
  };
  const updateBoardSizeX = (x: number) => {
    setX(x);
  };
  const updateBoardSizeY = (y: number) => {
    setY(y);
  };

  return (
    <GameContext.Provider value={{ gameId, boardSizeX, boardSizeY, setGameId: updateGameId, setBoardSizeX: updateBoardSizeX, setBoardSizeY: updateBoardSizeY }}>
      {children}
    </GameContext.Provider>
  );
}
