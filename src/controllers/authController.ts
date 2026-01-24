//src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/userModel";
import jwt from "jsonwebtoken";

const sendError = (code: number, message: string, res: Response) => {
  return res.status(code).send({ message });
}

type GenerateToken = {
  token: string;
  refreshToken: string;
};

const genetateToken = (userId: string): GenerateToken => {
    const secret = process.env.JWT_SECRET || "default_secret";

    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "3600"); // seconds
    const token = jwt.sign(
        { _id: userId},
        secret,
        { expiresIn: expiresIn }        
    );
    const refreshExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "1440"); // seconds
    const rand = Math.floor(Math.random() * 1000);
    const refreshToken = jwt.sign(
        { _id: userId, rand: rand },
        secret,
        { expiresIn: refreshExpiresIn }
    );
    return { token, refreshToken };
}

const register = async (req: Request, res: Response) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (!username || !email || !password) {
    return sendError(400, "Username, email and password are required", res);
  }

  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({"username": username, "email": email, "password": hashedPassword});
    const token = genetateToken(user._id.toString());
    user.refreshTokens.push(token.refreshToken);
    await user.save();

    return res.status(201).json({ _id: user._id, ...token });
  }catch(err){
    return sendError(500, "Internal server error", res);
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return sendError(400, "Email and password are required", res);
  } 
  try{
    const user = await User.findOne({email: email});
    if (!user) {
      return sendError(401, "Invalid email or password 1", res);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(401, "Invalid email or password 2", res);
    }
    const token = genetateToken(user._id.toString());
    user.refreshTokens.push(token.refreshToken);
    await user.save();
    return res.status(200).json({ _id: user._id, ...token });
  }catch(err){
    return sendError(500, "Internal server error", res);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return sendError(400, "Refresh token is required", res);
  }
  const secret = process.env.JWT_SECRET || "default_secret";
  try {
    const decoded = jwt.verify(refreshToken, secret) as { _id: string, rand?: number };

    const user = await User.findById(decoded._id);
    if (!user) {
      return sendError(401, "Invalid refresh token", res);
    }
    if (!user.refreshTokens.includes(refreshToken)) {
      user.refreshTokens = [];
      await user.save();
      return sendError(401, "Invalid refresh token", res);
    }
    const token = genetateToken(user._id.toString());
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(token.refreshToken);
    await user.save();
    return res.status(200).json(token);
  }catch(err){
    return sendError(401, "Internal server error", res);
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return sendError(400, "Refresh token is required", res);
  }
  const secret = process.env.JWT_SECRET || "default_secret";
  try {
    const decoded = jwt.verify(refreshToken, secret) as { _id: string };
    const user = await User.findById(decoded._id);
    if (!user) {
      return sendError(401, "Invalid refresh token", res);
    }
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return sendError(401, "Internal server error", res);
  }
};

export default {
  register,
  login,
  refreshToken,
  logout
};