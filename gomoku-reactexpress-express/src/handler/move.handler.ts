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
        const move = req.body
        
        const result = await playMove(move)

        if (result.error) {
            res.status(422).json({ error: result.error });
        } else {
            res.status(200).json({
                move: result.move,
                gameState: result.gameState
            });
        }
    }
);

export default moveHandler;
