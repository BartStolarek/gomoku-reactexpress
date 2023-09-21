import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { intersection } from 'lodash'

import validateSchema from '../middleware/validateSchema'
import { wss } from '../websocket'
import { createMoveSchema, getGameMovesSchema } from '../schema/move.schema'
import { playMove, getMovesByGameId } from '../service/move.service'
import { deserializeUser } from '../middleware/deserializeUser'

const moveHandler = express.Router()
moveHandler.use(deserializeUser)

// Play a move
moveHandler.put(
    '/',
    validateSchema(createMoveSchema),
    async (req: Request, res: Response) => {
        console.log('moveHandler.put Called (play a move)')
        const move = req.body
        
        const result = await playMove(move)

        console.log('moveHandler.put Played move ' + move.x + ', ' + move.y + ' for game ' + move.gameId)

        if (result.error) {
            res.status(422).json({ error: result.error });
        } else {
            res.status(200).json({
                gameState: result.gameState
            });
        }
    }
);

// Get moves for a game
moveHandler.get(
    '/:gameId',
    validateSchema(getGameMovesSchema),
    async (req: Request, res: Response) => {
        console.log('moveHandler.get Called get moves for a game')
        const gameId = req.params.gameId

        // Get a list of moves matching gameId
        const moves = await getMovesByGameId(gameId)

        console.log('gameHandler.get Found ' + moves.length + ' moves for game ' + gameId)

        res.status(200).json(moves);
    }
)


export default moveHandler;
