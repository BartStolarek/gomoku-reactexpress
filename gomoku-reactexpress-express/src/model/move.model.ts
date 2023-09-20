import mongoose, { Document } from "mongoose"
import { GameDocument } from "./game.model";

export interface MoveDocument extends Document {
    gameId: GameDocument["_id"];
    x: number,
    y: number,
    player_name: string
}

const moveSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    x: Number,
    y: Number,
    player_name: String
// The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
},{ timestamps: true })

export default mongoose.model<MoveDocument>("Move", moveSchema)

