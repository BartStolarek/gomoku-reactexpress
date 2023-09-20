import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { intersection } from 'lodash'

import validateSchema from '../middleware/validateSchema'
import { wss } from '../websocket'
import { createMoveSchema } from '../schema/move.schema'
import { playMove } from '../service/move.service'
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



export default moveHandler;
