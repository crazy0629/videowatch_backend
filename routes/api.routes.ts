import { Router } from "express";
import * as auth from "../controllers/user.controller";

const router = Router();

router.post("/auth/signin", auth.signIn);
router.post("/auth/signup", auth.signUp);

export default router;
