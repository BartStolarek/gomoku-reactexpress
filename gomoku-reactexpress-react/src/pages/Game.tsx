import { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { UserContext, GameContext } from "../context"
import { Button, Cell, Message } from "../components"
import { PLAYER_COLORS } from "../constants"
import { GameState, Move, SavedGame } from "../types"
import { useLocalStorage } from "../hooks"
import { API_HOST } from "../constants"
import { put, post } from "../utils/http"

import style from "./Game.module.css"
import { moveMessagePortToContext } from "worker_threads"

const getWebSocketURL = () => {
  if (!API_HOST) return "ws://localhost:8080"
  const hostURL = new URL(API_HOST)
  return `${hostURL.protocol === "https:" ? `wss` : `ws`}://${hostURL.hostname}`
}

// Game page function
export default function Game() {
  // Constants needed for the game page
  const { user } = useContext(UserContext) // Used to check if user is logged in
  const gameContext = useContext(GameContext) // Used to get users game context
  const { gameId, boardSizeX, boardSizeY } = gameContext // Used to get users required board size
  const navigate = useNavigate() // Used to navigate to other pages
  const [loading, setLoading] = useState(false);  

  const [gameState, setGameState] = useState<GameState>({
    board: Array(boardSizeY)
      .fill(0)
      .map(() => Array(boardSizeX).fill("grey")),
    currentPlayer: "black",
    currentMoveNumber: 1,
  }) // Used to keep track of the game state

  const [gameEnded, setGameEnded] = useState(false) // Used to check if the game has ended
  const [isWinner, setIsWinner] = useState<boolean>(false) // Used to check if the current player is the winner
  const [winningPlayer, setWinningPlayer] = useState<string | null>(null) // Used to keep track of the winning player

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Handle clicking the leave button
  const handleLeave = () => {
    navigate("/")
  }

  // Handle clicking a cell
  const handleCellClick = async (x: number, y: number) => {
    // If the game has ended do nothing
    if (loading || gameEnded) {
      return
    }
    // If the cell is already occupied do nothing
    if (gameState.board[x][y] !== "grey") {
      return
    }

    // Create a move
    const move: Move = {
      x: x,
      y: y,
      player_name: gameState.currentPlayer,
    }

    console.log("Sending move to server")

    setLoading(true);

    try {
      const response = await put<
        { gameId: string; x: number; y: number; player_name: string },
        { gameState: string }
      >(`${API_HOST}/api/move/`, {
        gameId: gameId,
        x: move.x,
        y: move.y,
        player_name: move.player_name
      })

      console.log(`Received from server response gameState: ${response.gameState}`)

      // Otherwise create a new board 
      const newBoard = [...gameState.board]
      newBoard[x][y] = gameState.currentPlayer

      // Update the current player to next player
      const nextPlayer = gameState.currentPlayer === "black" ? "white" : "black"
      
      // If response string is 'winner', else if response string is 'draw', else if response string is 'continue'
      if (response.gameState === 'winner') {
        setGameState({
          board: newBoard,
          currentPlayer: nextPlayer,
          currentMoveNumber: gameState.currentMoveNumber + 1,
        })
        setGameEnded(true)
        setIsWinner(true)
        setWinningPlayer(gameState.currentPlayer)
      }
      else if (response.gameState === 'draw') {
        setGameState({
          board: newBoard,
          currentPlayer: nextPlayer,
          currentMoveNumber: gameState.currentMoveNumber + 1,
        })
        setGameEnded(true)
      }
      else if (response.gameState === 'continue') {
        setGameState({
          board: newBoard,
          currentPlayer: nextPlayer,
          currentMoveNumber: gameState.currentMoveNumber + 1,
        })
      }
      else {
        console.log("Error: " + response)
      }
    } catch (error) {
      console.error("Error sending move to server:", error)
    } finally {
      setLoading(false);
    }
  }

  // Function to get the game message
  const getGameMessage = (): {
    variant: "info" | "success" | "draw" | "error"
    message: string
  } => {
    if (gameEnded) {
      if (winningPlayer) {
        return {
          variant: "success",
          message: `${capitalizeFirstLetter(winningPlayer)} won the game!`,
        }
      } else {
        return {
          variant: "draw",
          message: `It's a draw!`,
        }
      }
    } else {
      return {
        variant: "info",
        message: `${capitalizeFirstLetter(gameState.currentPlayer)}'s turn`,
      }
    }
  }


  if (!user) return <Navigate to="/login" /> // Check if user is logged in

  const gameMessage = getGameMessage() // Update message to user

  return (
    <div className={style.pageContainer}>
      <div className={style.section}>
        <Message variant={gameMessage.variant} message={gameMessage.message} />
      </div>
      <div className={style.section}>
        <div className={style.gameBoard}>
          {gameState.board.map((row, i) => (
            <div key={i} className={style.gameRow}>
              {row.map((cell, j) => (
                <Cell
                  x={i}
                  y={j}
                  key={`cell-${i}-${j}`}
                  occupied={cell !== "grey"}
                  player={{ name: cell, color: PLAYER_COLORS[cell] }}
                  onClick={() => handleCellClick(i, j)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={style.section}>
        <Button
          type="submit"
          onClick={async () => {
            console.log("Attempting to create a game")
            setGameState({
              board: Array(boardSizeY)
                .fill(0)
                .map(() => Array(boardSizeX).fill("grey")),
              currentPlayer: "black",
              currentMoveNumber: 1,
            })
            setGameEnded(false)
            setIsWinner(false)
            setWinningPlayer(null)

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

            } catch (error) {
              console.error("Error creating the game:", error)
            } 
          }}
        >
          Restart
        </Button>
        <Button type="submit" onClick={handleLeave}>
          Leave
        </Button>
      </div>
    </div>
  )
}
