import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context';
import { Button } from '../components';
import { SavedGame } from '../types';
import { useLocalStorage } from '../hooks';

import style from './Games.module.css';

export default function Games() {
  const { user } = useContext(UserContext);
  const [savedGames] = useLocalStorage<SavedGame[]>('savedGamesKey', []);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // Function to obtain the winner string or a draw if the string is null
  const getWinnerString = (string?: string | null) => {
    if (string === null){
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
          {savedGames.map((game, index) => (
            <div key={index} className={style.gameBox}>
              <span>
                Game #{game.gameId}   
              </span>
              <span>
                @ {new Date(game.date).toLocaleDateString()} 
              </span>
              <span>
                {getWinnerString(game.winningPlayer)}
              </span>
              <Button
                type="submit"
                onClick={() => {
                  navigate(`/game-log/${game.gameId}`);
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

