import mongoose, { DocumentDefinition } from 'mongoose'
import GameModel, { GameDocument } from '../model/game.model'
import MoveModel, { MoveDocument } from '../model/move.model'

// Create
export async function createGame(gameInput: Partial<GameDocument>): Promise<GameDocument> {
    // Set the default values for status and winningPlayer
    const newGame: Partial<GameDocument> = {
        boardSizeX: gameInput.boardSizeX,
        boardSizeY: gameInput.boardSizeY,
        status: "continue",
        winningPlayer: "none"
    };

    // Create the game in the database using the GameModel
    const createdGame = await GameModel.create(newGame);

    return createdGame;
}

// Read
export async function getGameById(id: string) {
    return GameModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean()
}

export async function getAllGames() {
    return GameModel.find().lean()
}

export async function getGameMoves(id: string) {
    // Look through MoveModel and find all moves with the gameId of id
    return MoveModel.find({ gameId: new mongoose.Types.ObjectId(id) }).lean()
}

// Update
export async function updateGame(id: string, input: DocumentDefinition<GameDocument>) {
    return GameModel.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
        },
        input,
        { new: true }
    )
}

// Delete
export async function deleteGame(id: string) {
    return GameModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
}

