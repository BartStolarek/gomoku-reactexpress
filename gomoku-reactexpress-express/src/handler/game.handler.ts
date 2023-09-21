import express, { Request, Response } from 'express'

import validateSchema from '../middleware/validateSchema'
import { wss } from '../websocket'
import { createGameSchema, getGameSchema } from '../schema/game.schema'
import { createGame, getAllGames, getGameById } from '../service/game.service'
import { deserializeUser } from '../middleware/deserializeUser'

const gameHandler = express.Router()
gameHandler.use(deserializeUser)

// Create a game
gameHandler.post(
    '/',
    validateSchema(createGameSchema),
    async (req: Request, res: Response) => {
        console.log('gameHandler.post Called (create a game)')
        const game = req.body
        
        const createdGame = await createGame(game)
        
        // Console log the created game's id
        console.log('gameHandler.post Created game with id: ' + createdGame._id)

        res.status(200).json({
            gameId: createdGame._id
        }); 

        console.log('gameHandler.post finished handling post request')
    }
);

// Get all games
gameHandler.get(
    '/games',
    async (req: Request, res: Response) => {
        console.log(`gameHandler.get Called get all games`)

        // Get all games
        const games = await getAllGames()

        console.log(`gameHandler.get Found ${games.length} games`)

        res.status(200).json(games);
    }
)


// Get a game
gameHandler.get(
    '/:gameId',
    validateSchema(getGameSchema),
    async (req: Request, res: Response) => {
        console.log('gameHandler.get Called get game with id: ' + req.params.gameId)
        const gameId = req.params.gameId

        // Get a list of moves matching gameId
        const moves = await getGameById(gameId)

        console.log('gameHandler.get Found game with id: ' + gameId)

        res.status(200).json(moves);
    }
)



export default gameHandler;
