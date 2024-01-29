import { Router } from "express";

import * as auth from "../controllers/user.controller";
import * as video from "../controllers/video.controller";

const router = Router();

router.post("/auth/signin", auth.signIn);
router.post("/auth/signup", auth.signUp);
router.post("/auth/getTopRatedUsers", auth.getTopRatedUsers);
router.post("/auth/addPoint", auth.addPoint);

router.post("/upload/detail", video.loadVideoDetailInfo);
router.post("/video/getMoreVideos", video.getMoreVideos);
router.post("/video/getDetailInfo", video.getDetailInfo);

export default router;
