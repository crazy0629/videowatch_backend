import { model, Schema } from "mongoose";
import { IVideo } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const VideoSchema = new Schema(
  {
    adFileName: { type: String },
    uploadDate: { type: Date },
    duration: { type: Number },
    viewCount: { type: Number },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

/**
 * IUser Interface Document class inheritance
 */

export default model<IVideo>("Video", VideoSchema);
