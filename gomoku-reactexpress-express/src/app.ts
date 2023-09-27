import { createServer } from 'http'
import express, { Express } from 'express'
import cors from 'cors'

import authHandler from './handler/auth.handler'
import gameHandler from './handler/game.handler'
import moveHandler from './handler/move.handler'

const app: Express = express()

app.use(
  cors({
    origin: process.env.allowHost || true,
  })
)

app.use(express.json())

app.use('/api/auth', authHandler)
app.use('/api/game', gameHandler)
app.use('/api/move', moveHandler)

export const server = createServer(app)

export default app
