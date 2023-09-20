import { object, string, number, array, TypeOf } from 'zod';

const payload = {
    body: object({
        gameId: string({
            required_error: 'Game id is required'
        }),
        x: number({
            required_error: 'X is required'
        }).nonnegative(),
        y: number({
            required_error: 'Y is required'
        }).nonnegative(),
        player_name: string({
            required_error: 'Player name is required'
        })
    })
}

const moveParams = {
    params: object({
        moveId: string({
            required_error: 'Move id is required',
        }),
    }),
}


export const createMoveSchema = object({
    ...payload,
})
export const getMoveSchema = object({
    ...moveParams,
})
export const updateMoveSchema = object({
    ...moveParams,
    ...payload,
})
export const deleteMoveSchema = object({
    ...moveParams,
})

export type CreateGameInput = TypeOf<typeof createMoveSchema>
export type ReadGameInput = TypeOf<typeof getMoveSchema>
export type UpdateGameInput = TypeOf<typeof updateMoveSchema>
export type DeleteGameInput = TypeOf<typeof deleteMoveSchema>
