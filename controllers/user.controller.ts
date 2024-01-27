import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../service/helper";
import bcrypt from "bcrypt";

/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */

export const signUp = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.json({
        success: false,
        message: "Please input your registration data",
      });
    }

    const user = await User.findOne({ email: req.body.username });

    if (user) {
      return res.json({ success: false, message: "Username already exists!" });
    }

    const payload = {
      username: req.body.username,
      password: req.body.password,
      point: 0,
    };

    const newUser = new User(payload);
    await newUser.save();

    return res.json({
      success: true,
      message: "Successfully registered!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error found!",
    });
  }
};

/**
 * User sign in function
 * @param req
 * @param res
 * @returns
 */

export const signIn = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.json({
        success: false,
        message: "Please input data!",
      });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exists!",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      return res.json({
        success: true,
        message: "Success! You're in",
        token: generateToken(user),
      });
    }
    return res.json({
      success: false,
      message: "Incorrect email or password. Please try again.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error found!",
    });
  }
};
