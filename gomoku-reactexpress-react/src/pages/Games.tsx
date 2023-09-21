import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context';
import { Button } from '../components';
import { SavedGame } from '../types';
import { get } from '../utils/http';
import { useState, useEffect } from 'react';
import { API_HOST } from '../constants';

import style from './Games.module.css';

export default function Games() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [games, setGames] = useState<SavedGame[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await get<SavedGame[]>(`${API_HOST}/api/game/games`);
        if (response) setGames(response);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };
    fetchGames();
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // Function to obtain the winner string or a draw if the string is null
  const getWinnerString = (string?: string) => {
    console.log(`winningPlayer string is: ${string}`)
    if (string === "unfinished"){
      return "Unfinished"
    } else if (string === "draw"){
      return "Draw"
    } else {
      return `Winner: ${capitalizeFirstLetter(string!)}`
    }
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <div className={style.pageContainer}>
      <div className={style.section}>
        <div className={style.gamesList}>
          {games.map((game, index) => (
            <div key={index} className={style.gameBox}>
              <span>
                Game #{index + 1}   
              </span>
              <span>
                @ {new Date(game.createdAt).toLocaleDateString()} 
              </span>
              <span>
                {getWinnerString(game.winningPlayer)}
              </span>
              <Button
                type="submit"
                onClick={() => {
                  navigate(`/game-log/${game._id}`);
                }}
              >
                View Game Log
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className={style.section}>
        <Button
          type="submit"
          onClick={() => {
            navigate('/');
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
