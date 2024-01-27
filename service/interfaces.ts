import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  point: number;
}
