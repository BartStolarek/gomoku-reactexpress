import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context';
import { useParams } from 'react-router-dom';
import { SavedGame, GameState, Move } from '../types';
import { PLAYER_COLORS } from '../constants';
import { Cell, Button } from '../components';
import { get } from "../utils/http"
import { API_HOST } from '../constants';

import style from './GameLog.module.css';

export default function GameLog() {
  const { gameId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameDetails, setGameDetails] = useState<SavedGame | null>(null); // Store game details

  useEffect(() => {
    const fetchGameLog = async () => {
      try {
        // Fetch the game details
        const fetchedGameDetails = await get<SavedGame>(`${API_HOST}/api/game/${gameId}`);
        setGameDetails(fetchedGameDetails);
    
        // Fetch the moves for the game
        const fetchedMoves = await get<Move[]>(`${API_HOST}/api/move/${gameId}`);
    
        // Sort moves in chronological order using createdAt
        const sortedMoves = fetchedMoves.sort((a, b) => 
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );

        setMoves(sortedMoves);

        const board = Array(fetchedGameDetails.boardSizeY).fill(0).map(() => Array(fetchedGameDetails.boardSizeX).fill('grey'));
        
        // Apply the moves to the board
        sortedMoves.forEach(move => {
          board[move.x][move.y] = move.player_name;
        });
    
        setGameState({
          board: board,
          currentPlayer: 'black',
          currentMoveNumber: sortedMoves.length + 1,
        });
      } catch (error) {
        console.error("Failed to fetch game log:", error);
      }
    };

    fetchGameLog();
  }, [gameId]);

  if (!user) return <Navigate to="/login" />;

  if (!gameState || !gameDetails) return <p>Loading game...</p>;

  const getGameResult = () => {
    if (gameDetails.status === "unfinished") return "";
    if (gameDetails.winningPlayer === "none") return "Draw";
    return `Winner: ${capitalizeFirstLetter(gameDetails.winningPlayer)}`;
  };
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className={style.pageContainer}>
      <p>Game Log <span>{getGameResult()}</span></p>
      <div className={style.section}>
        <div className={style.gameBoard}>
          {gameState.board.map((row, i) => (
            <div key={i} className={style.gameRow}>
              {row.map((cell, j) => {
                const move = moves.find(move => move.x === i && move.y === j);
                const moveId = move ? moves.indexOf(move) + 1 : undefined;

                return (
                  <Cell
                    x={i}
                    y={j}
                    key={`cell-${i}-${j}`}
                    occupied={cell !== 'grey'}
                    player={{ name: cell, color: PLAYER_COLORS[cell] }}
                    moveId={moveId}
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
