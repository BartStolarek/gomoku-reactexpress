import mongoose, { Document } from "mongoose"

export interface GameDocument extends Document {
    boardSizeY: number;
    boardSizeX: number;
    status: string;
    winningPlayer: string;
}

const gameSchema = new mongoose.Schema({
    boardSizeY: Number,
    boardSizeX: Number,
    status: String,
    winningPlayer: String
// The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
},{ timestamps: true })

export default mongoose.model<GameDocument>("Game", gameSchema)

