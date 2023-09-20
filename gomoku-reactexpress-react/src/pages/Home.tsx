import { useContext, useRef } from "react"
import { GameContext } from "../context"
import { useNavigate } from "react-router-dom"
import { Button } from "../components"
import { API_HOST } from "../constants"
import style from "./Home.module.css"
import { post } from "../utils/http"

const getWebSocketURL = () => {
  if (!API_HOST) return "ws://localhost:8080"
  const hostURL = new URL(API_HOST)
  return `${hostURL.protocol === "https:" ? `wss` : `ws`}://${hostURL.hostname}`
}

export default function Home() {
  const navigate = useNavigate()
  const numberOptions = Array.from({ length: 30 }, (_, i) => i + 1) // Creates an array of numbers from 1 to 30
  const gameContext = useContext(GameContext)
  const { gameId, boardSizeX, boardSizeY } = gameContext

  // Create refs for the select inputs
  const widthRef = useRef<HTMLSelectElement>(null)
  const heightRef = useRef<HTMLSelectElement>(null)

  return (
    <div className={style.pageContainer}>
      <div className={style.section}>
        <div className={style.dropdownContainer}>
          <label htmlFor="widthSelect">Width</label>
          <select
            id="widthSelect"
            name="width"
            defaultValue={boardSizeX}
            ref={widthRef}
          >
            {numberOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className={style.dropdownContainer}>
          <label htmlFor="heightSelect">Height</label>
          <select
            id="heightSelect"
            name="height"
            defaultValue={boardSizeY}
            ref={heightRef}
          >
            {numberOptions.map((num) => (
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
          onClick={async () => {
            console.log("Attempting to create a game")

            if (widthRef.current && heightRef.current) {
              const boardSizeX = Number(widthRef.current.value)
              const boardSizeY = Number(heightRef.current.value)

              try {
                // Make a POST request to create the game
                const response = await post<
                  { boardSizeX: number; boardSizeY: number },
                  { gameId: string }
                >(`${API_HOST}/api/game/`, {
                  boardSizeX: boardSizeX,
                  boardSizeY: boardSizeY,
                })

                console.log("Game created with ID:", response.gameId)
                
                gameContext.setGameId(response.gameId)
                gameContext.setBoardSizeX(boardSizeX)
                gameContext.setBoardSizeY(boardSizeY)

                navigate("game") // Navigate only after successfully creating the game
              } catch (error) {
                console.error("Error creating the game:", error)
              }
            }
          }}
        >
          Start Game
        </Button>
      </div>
    </div>
  )
}
