import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import * as auth from "../controllers/user.controller";
import * as video from "../controllers/video.controller";

const router = Router();

const video_dir = path.join(__dirname, "../uploads/video");

const videoStorage = multer.diskStorage({
  destination: video_dir,
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  },
});

const uploadVideo = multer({ storage: videoStorage });

router.post("/auth/signin", auth.signIn);
router.post("/auth/signup", auth.signUp);
router.post("/auth/getTopRatedUsers", auth.getTopRatedUsers);

router.post("/asset/upload", uploadVideo.single("ad"), video.uploadVideo);
router.post("/upload/cancel", video.cancelUpload);
router.post("/upload/detail", video.loadVideoDetailInfo);
router.post("/video/getMoreVideos", video.getMoreVideos);
router.post("/video/getDetailInfo", video.getDetailInfo);

export default router;
