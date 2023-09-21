import mongoose, { DocumentDefinition } from 'mongoose'
import MoveModel, { MoveDocument } from '../model/move.model'
import GameModel from '../model/game.model'

// Create
export async function createMove(move: DocumentDefinition<MoveDocument>) {
    return MoveModel.create(move)
}

// Read
export async function getMoveById(id: string) {
    return MoveModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean()
}

export async function getMovesByGameId(gameId: string) {
    return MoveModel.find({ gameId: new mongoose.Types.ObjectId(gameId) }).lean()
}

// Update
export async function updateMove(id: string, input: DocumentDefinition<MoveDocument>) {
    return MoveModel.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
        },
        input,
        { new: true }
    )
}

// Delete
export async function deleteMove(id: string) {
    return MoveModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
}

// GAME LOGIC

// Play Move and Check Game State
export async function playMove(move: DocumentDefinition<MoveDocument>) {
    
    // Check move is valid
    const valid = await checkMoveValid(move);

    if (valid) {

        // Save the move
        const createdMove = await MoveModel.create(move);

        // After saving the move, check the game state
        const gameState = await checkGameState(createdMove.gameId);

        return {
            move: createdMove,
            gameState: gameState
        }
    } else {
        // Return an error
        return {
            error: "Invalid Move"
        }
    }
    
}


async function checkMoveValid (move: DocumentDefinition<MoveDocument>): Promise<boolean> {

    // Check if the move is within the board's boundaries
    const game = await GameModel.findOne({ _id: move.gameId });
    if (!game) {
        throw new Error('Game not found');
    }
    const boardSizeX = game.boardSizeX;
    const boardSizeY = game.boardSizeY;
    if (move.x < 0 || move.x >= boardSizeX || move.y < 0 || move.y >= boardSizeY) {
        return false;
    }

    // Check if the move already exists
    const existingMove = await MoveModel.findOne({ gameId: move.gameId, x: move.x, y: move.y });
    if (existingMove) {
        return false;
    }

    return true;
}


// Check Game State
async function checkGameState(gameId: string): Promise<string> {
    // Step 1: Get all moves with the given gameId
    const moves = await MoveModel.find({ gameId: gameId });

    // Step 2: Get the board size
    const game = await GameModel.findOne({ _id: gameId });
    if (!game) {
        throw new Error('Game not found');
    }
    const boardSizeX = game.boardSizeX;
    const boardSizeY = game.boardSizeY;

    // Step 3: Recreate the gomoku board
    const board = Array(boardSizeY).fill(null).map(() => Array(boardSizeX).fill('grey'));
    moves.forEach(move => {
        board[move.x][move.y] = move.player_name;
    });

    // Step 4: Check for a winner
    for (const move of moves) {
        if (checkWinner(move.x, move.y, board, boardSizeX, boardSizeY)) {
            // Update the game in database
            game.status = 'winner'
            game.winningPlayer = move.player_name

            // Save the updated game
            await game.save()

            return 'winner';
        }
    }

    // Step 5: Check for a draw
    if (checkDraw(board)) {
        // Update the game in database
        game.status = 'draw'
        game.winningPlayer = 'draw'

        // Save the updated game
        await game.save()

        return 'draw';
    }

    // Step 6: If neither, the game state remains as 'continue'
    return 'continue';
}


function checkWinner(
    x: number,
    y: number,
    board: ("grey" | "black" | "white")[][],
    boardSizeX: number,
    boardSizeY: number
): boolean {
    const directions = [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];
    for (const [dx, dy] of directions) {
        let count = 0;
        for (let step = 0; step < 5; step++) {
        const checkX = x + dx * step;
        const checkY = y + dy * step;
        if (
            checkX < 0 ||
            checkX >= boardSizeX ||
            checkY < 0 ||
            checkY >= boardSizeY
        ) {
            break;
        }
        if (board[checkX][checkY] === board[x][y]) {
            count++;
        } else {
            break;
        }
        }
        if (count === 5) {
        return true;
        }
    }
    return false;
}

function checkDraw(board: ("grey" | "black" | "white")[][]): boolean {
  return board.every(row => row.every(cell => cell !== "grey"));
}
