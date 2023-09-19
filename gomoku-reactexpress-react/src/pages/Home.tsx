import { useContext, useRef } from 'react';
import { GameContext } from '../context';
import {  useNavigate } from 'react-router-dom';
import { Button, } from '../components';
import style from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const numberOptions = Array.from({ length: 30 }, (_, i) => i + 1); // Creates an array of numbers from 1 to 30
  const gameContext = useContext(GameContext);
  const { boardSizeX, boardSizeY } = gameContext;

  // Create refs for the select inputs
  const widthRef = useRef<HTMLSelectElement>(null);
  const heightRef = useRef<HTMLSelectElement>(null);


  return (
    <div className={style.pageContainer}>
      <div className={style.section}>
        <div className={style.dropdownContainer}>
          <label htmlFor="widthSelect">Width</label>
          <select id="widthSelect" name="width" defaultValue={boardSizeX} ref={widthRef}>
            {numberOptions.map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className={style.dropdownContainer}>
          <label htmlFor="heightSelect">Height</label>
          <select id="heightSelect" name="height" defaultValue={boardSizeY} ref={heightRef}>
            {numberOptions.map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={style.section}>
      <Button
        type="submit"
        onClick={() => {
          console.log('Navigating to /Game');
          if (widthRef.current && heightRef.current) {
            gameContext.setBoardSizeX(Number(widthRef.current.value));
            gameContext.setBoardSizeY(Number(heightRef.current.value));
            navigate('game');
          }
        }}
      >
        Start Game
      </Button>

      </div>
    </div>
  );
}
