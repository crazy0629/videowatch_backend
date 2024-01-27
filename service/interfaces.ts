import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  point: number;
}

export interface IVideo extends Document {
  adFileName: string;
  uploadDate: Date;
  duration: number;
  viewCount: number;
  title: string;
  description: string;
}
