import { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { UserContext, GameContext } from "../context"
import { Button, Cell, Message } from "../components"
import { PLAYER_COLORS } from "../constants"
import { GameState, Move, SavedGame } from "../types"
import { useLocalStorage } from "../hooks"

import style from "./Game.module.css"

// Game page function
export default function Game() {
  // Constants needed for the game page
  const { user } = useContext(UserContext) // Used to check if user is logged in
  const { gameId, boardSizeX, boardSizeY } = useContext(GameContext) // Used to get users required board size
  const [savedGames, setSavedGames] = useLocalStorage<SavedGame[]>(
    "savedGamesKey",
    []
  ) // Used to save the game
  const navigate = useNavigate() // Used to navigate to other pages

  const [gameState, setGameState] = useState<GameState>({
    board: Array(boardSizeY)
      .fill(0)
      .map(() => Array(boardSizeX).fill("grey")),
    currentPlayer: "black",
    moves: [],
    currentMoveNumber: 1,
  }) // Used to keep track of the game state

  const [gameEnded, setGameEnded] = useState(false) // Used to check if the game has ended
  const [isWinner, setIsWinner] = useState<boolean>(false) // Used to check if the current player is the winner
  const [winningPlayer, setWinningPlayer] = useState<string | null>(null) // Used to keep track of the winning player

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Function to check if the current player has won the game
  const checkWinner = (
    x: number,
    y: number,
    board: ("grey" | "black" | "white")[][]
  ): boolean => {
    const directions = [
      [0, 1], // North
      [1, 1], // North-East
      [1, 0], // East
      [1, -1], // South-East
      [0, -1], // South
      [-1, -1], // South-West
      [-1, 0], // West
      [-1, 1], // North-West
    ]
    // For each direction above
    for (const [dx, dy] of directions) {
      let count = 0
      // Check current stone and 4 in that direction
      for (let step = 0; step < 5; step++) {
        // Assign the coordinates of stone you are checking
        const checkX = x + dx * step
        const checkY = y + dy * step
        // If the stone is out of bounds, break
        if (
          checkX < 0 ||
          checkX >= boardSizeX ||
          checkY < 0 ||
          checkY >= boardSizeY
        ) {
          break
        }
        // If the stone is same colour as the current player, add to count
        if (board[checkX][checkY] === gameState.currentPlayer) {
          count++
        } else {
          break
        }
      }
      // If count reaches 5 then player has won
      if (count === 5) {
        return true
      }
    }
    // No winner found
    return false
  }

  // Check for valid moves, if none then game is a draw
  const checkDraw = (board: ("grey" | "black" | "white")[][]): boolean => {
    return board.every((row) => row.every((cell) => cell !== "grey"))
  }

  // Handle clicking the leave button, if game is ended save it, if not then toss it
  const handleLeave = () => {
    // If the game has ended
    if (gameEnded) {
      // Get Current datetime in iso string format to save against the game
      const currentDateTime = new Date().toISOString()

      // Determine the new gameId by adding 1 to the highest gameId in the savedGames array
      const highestGameId =
        savedGames.length > 0
          ? Math.max(...savedGames.map((game) => parseInt(game.gameId)))
          : 0
      const newGameId = (highestGameId + 1).toString()
      
      // Create a new saved game object
      const newSavedGame = {
        gameId: newGameId,
        date: currentDateTime,
        moves: gameState.moves, // Directly use the gameState.moves without any modification
        winningPlayer: isWinner ? winningPlayer as "black" | "white" : null,
        boardSizeX: boardSizeX,
        boardSizeY: boardSizeY,
      }

      // Add the new saved game to the savedGames array
      setSavedGames((prev) => [...prev, newSavedGame])
    } else {
    }

    navigate("/")
  }

  // Handle clicking a cell
  const handleCellClick = (x: number, y: number) => {
    // If the game has ended do nothing
    if (gameEnded) {
      return
    }
    // If the cell is already occupied do nothing
    if (gameState.board[x][y] !== "grey") {
      return
    }

    // Otherwise create a new board 
    const newBoard = [...gameState.board]
    newBoard[x][y] = gameState.currentPlayer

    // Create a move
    const move: Move = {
      id: gameState.currentMoveNumber,
      x: x,
      y: y,
      player: {
        name: gameState.currentPlayer,
        color: PLAYER_COLORS[gameState.currentPlayer],
      },
    }
    const newMoves = [...gameState.moves, move] // add move to newMoves array

    // Update the current player to next player
    const nextPlayer = gameState.currentPlayer === "black" ? "white" : "black"

    // Check if there was a winner or a draw, and finish the game appropriately
    if (checkWinner(x, y, newBoard)) {  
      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        moves: newMoves,
        currentMoveNumber: gameState.currentMoveNumber + 1,
      })
      setGameEnded(true)
      setIsWinner(true)
      setWinningPlayer(gameState.currentPlayer)
    } else if (checkDraw(newBoard)) {
      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        moves: newMoves,
        currentMoveNumber: gameState.currentMoveNumber + 1,
      })
      setGameEnded(true)
    } else {
      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        moves: newMoves,
        currentMoveNumber: gameState.currentMoveNumber + 1,
      })
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
          onClick={() => {
            setGameState({
              board: Array(boardSizeY)
                .fill(0)
                .map(() => Array(boardSizeX).fill("grey")),
              currentPlayer: "black",
              moves: [],
              currentMoveNumber: 1,
            })
            setGameEnded(false)
            setIsWinner(false)
            setWinningPlayer(null)
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
