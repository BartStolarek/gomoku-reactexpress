import { object, string, number, array, TypeOf } from 'zod';


const createPayload = {
    body: object({
        boardSizeY: number({
            required_error: 'Board size Y is required'
        }).nonnegative(),
        boardSizeX: number({
            required_error: 'Board size X is required'
        }).nonnegative()
    })
}

const gameParams = {
    params: object({
        gameId: string({
            required_error: 'Game id is required',
        }),
    }),
}

const updateGameStatePayload = {
    body: object({
        status: string({
            required_error: 'Status is required'
        }),
        winningPlayer: string({
            required_error: 'Winning player is required'
        })
    })
}


export const createGameSchema = object({
    ...createPayload,
})
export const getGameSchema = object({
    ...gameParams,
})
export const getGameMovesSchema = object({
    ...gameParams,
})
export const updateGameSchema = object({
    ...gameParams,
    ...updateGameStatePayload,
})
export const deleteGameSchema = object({
    ...gameParams,
})


export type CreateGameInput = TypeOf<typeof createGameSchema>
export type ReadGameInput = TypeOf<typeof getGameSchema>
export type ReadGameMovesInput = TypeOf<typeof getGameMovesSchema>
export type UpdateGameInput = TypeOf<typeof updateGameSchema>
export type DeleteGameInput = TypeOf<typeof deleteGameSchema>
