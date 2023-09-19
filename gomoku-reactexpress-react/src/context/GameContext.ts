import { createContext } from 'react';

// GameContextType is the type of the context object
// This will hold the current games board size. 
type GameContextType = {
  boardSizeX: number;
  boardSizeY: number;
  setBoardSizeX: (boardSizeX: number) => void;
  setBoardSizeY: (boardSizeY: number) => void;
};

const defaultSetFunction = () => {
  console.warn("setBoardSizeX or setBoardSizeY is not yet initialized");
};

const GameContext = createContext<GameContextType>({
  boardSizeX: 15,
  boardSizeY: 15,
  setBoardSizeX: defaultSetFunction,
  setBoardSizeY: defaultSetFunction
});

export default GameContext;