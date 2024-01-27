import JwtWebToken from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { IUser } from "../service/interfaces";

/**
 * Generate User Token Infomation by jsonwebtoken
 * @param user
 * @returns
 */

export const generateToken = (user: IUser) => {
  return JwtWebToken.sign(
    {
      id: user.id,
      username: user.username,
      password: user.password,
      point: user.point,
    },
    SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
};
