import { Request, Response } from "express";
import mongoose from "mongoose";

import Video from "../models/video";
import User from "../models/user";

const { getVideoDurationInSeconds } = require("get-video-duration");

export const loadVideoDetailInfo = async (req: Request, res: Response) => {
  try {
    const newVideo = new Video();
    newVideo.adFileName = req.body.videoLink;
    newVideo.title = req.body.title;
    newVideo.description = req.body.description;
    newVideo.uploadDate = new Date();
    newVideo.viewCount = 0;
    // newVideo.duration = await getVideoDurationInSeconds(req.body.videoLink);
    newVideo.duration = 0;
    await newVideo.save();

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
