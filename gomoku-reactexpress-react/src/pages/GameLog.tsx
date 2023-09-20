import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks';
import { SavedGame, GameState } from '../types';
import { PLAYER_COLORS } from '../constants';
import { Cell, Button } from '../components';
import { get } from "../utils/http"

import style from './GameLog.module.css';

export default function GameLog() {
  const { gameId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [savedGames] = useLocalStorage<SavedGame[]>('savedGamesKey', []);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // Find the saved game with the given gameId
    const foundGame = savedGames.find(game => game.gameId === gameId);
    if (foundGame) {
      const board = Array(foundGame.boardSizeY).fill(0).map(() => Array(foundGame.boardSizeX).fill('grey'));
      // Apply the moves to the board
      foundGame.moves.forEach(move => {
        board[move.x][move.y] = move.player_name;
      });
      // Set the gameState
      setGameState({
        board: board,
        currentPlayer: 'black', // Doesn't matter as it's not interactive
        currentMoveNumber: foundGame.moves.length + 1, // Just to be consistent
      });
    }
  }, [gameId, savedGames]);

  if (!user) return <Navigate to="/login" />;

  if (!gameState) return <p>Loading game...</p>; // or some other loading UI

  return (
    <div className={style.pageContainer}>
      <p>Game Log</p>
      <div className={style.section}>
        <div className={style.gameBoard}>
          {gameState.board.map((row, i) => (
            <div key={i} className={style.gameRow}>
              {row.map((cell, j) => {
                // Find the moveId for this cell (if any)
                

                // Need to get the moves from the database
                // const response = await get<
                //   { gameId: string },
                //   { id: string }[]
                // >(`${API_HOST}/api/game/```, {
                //   gameId: gameId,
                //   x: move.x,
                //   y: move.y,
                //   player_name: move.player_name
                // });
                const moveId = 1; // this is wrong

                return (
                  <Cell
                    x={i}
                    y={j}
                    key={`cell-${i}-${j}`}
                    occupied={cell !== 'grey'}
                    player={{ name: cell, color: PLAYER_COLORS[cell] }}
                    moveId={moveId}  // Pass the moveId to the Cell component
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className={style.section}>
        <Button
                type="submit"
                onClick={() => {
                  navigate(`/games`);
                }}
              >
                Back
        </Button>
      </div>
    </div>
  );
}
