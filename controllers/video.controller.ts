import { Request, Response } from "express";
import Multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import Video from "../models/video";
import User from "../models/user";

const { getVideoDurationInSeconds } = require("get-video-duration");

/**
 * Upload Video function
 *
 * @param req
 * @param res
 * @returns
 */

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const multerReq = req as Request & { file?: Multer.File };
    if (!multerReq?.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const { filename, originalname } = multerReq.file;

    const newVideo = new Video();
    newVideo.adFileName = "/uploads/video/" + filename;
    newVideo.uploadDate = req.body.uploadDate;
    newVideo.title = "";
    newVideo.description = "";
    newVideo.viewCount = 0;
    const video_dir = path.join(__dirname, "../uploads/video/" + filename);
    newVideo.duration = await getVideoDurationInSeconds(video_dir);
    await newVideo.save();

    res.json({
      success: true,
      message: "Success! Your video has been uploaded successfully!",
      filename,
      originalname,
      model: newVideo,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error found!",
    });
  }
};

export const loadVideoDetailInfo = async (req: Request, res: Response) => {
  try {
    const model = await Video.findById(
      new mongoose.Types.ObjectId(req.body.videoId)
    );
    if (!model) {
      return res.json({
        success: false,
        message: "Error found!",
      });
    }
    model.title = req.body.title;
    model.description = req.body.description;
    await model.save();
    res.json({
      success: true,
      message: "Successfully loaded detail information!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error found!",
    });
  }
};

/**
 * Cancel upload function when users press close button
 *
 * @param req
 * @param res
 */

export const cancelUpload = async (req: Request, res: Response) => {
  try {
    Video.findById(new mongoose.Types.ObjectId(req.body.adId)).then(
      async (model: any) => {
        if (!model) {
          return res.json({
            success: true,
            message: "Upload is cancelled successfully",
          });
        }
        const adFilePath = path.join(__dirname, "/.." + model.adFileName);
        fs.unlink(adFilePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
          console.log("File deleted successfully");
        });

        const adObj = await Video.findByIdAndDelete(
          new mongoose.Types.ObjectId(req.body.adId)
        );
        return res.json({
          success: true,
          message: "Upload is cancelled successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error found!",
    });
  }
};

export const getMoreVideos = async (req: Request, res: Response) => {
  try {
    let nextVideos = await Video.find()
      .sort({ uploadDate: -1 })
      .skip(req.body.index * 50)
      .limit(50);
    return res.json({
      success: true,
      message: "Successfully loaded!",
      data: nextVideos,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error found!",
    });
  }
};

export const getDetailInfo = async (req: Request, res: Response) => {
  try {
    const model = await Video.findById(
      new mongoose.Types.ObjectId(req.body.videoId)
    );
    if (!model) {
      return res.json({
        success: false,
        message: "Error found!",
      });
    }

    const user = await User.findById(
      new mongoose.Types.ObjectId(req.body.userId)
    );
    if (!user) {
      return res.json({
        success: false,
        message: "Error found!",
      });
    }
    user.point = user.point + 10;
    await user.save();

    model.viewCount = model.viewCount + 1;
    await model.save();

    if (req.body.shared != "") {
      const shareUser = await User.findById(
        new mongoose.Types.ObjectId(req.body.shared)
      );
      if (!shareUser) {
        return res.json({
          success: false,
          message: "Error found!",
        });
      }
      shareUser.point = shareUser.point + 5;
      await shareUser.save();
    }

    return res.json({
      success: true,
      message: "Success!",
      data: model,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error found!",
    });
  }
};
