import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { intersection } from 'lodash'

import validateSchema from '../middleware/validateSchema'
import { wss } from '../websocket'
import { createGameSchema } from '../schema/game.schema'
import { createGame } from '../service/game.service'
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

export default gameHandler;
