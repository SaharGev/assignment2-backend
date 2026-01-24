//controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import userModel from '../model/userModel';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string | undefined;
    const email = req.query.email as string | undefined;
    if (username) {
      const users = await userModel.find({ username: username }).select("-password -refreshTokens");
      return res.status(200).json(users);
    } else if (email) {
      const users = await userModel.find({ email: email }).select("-password -refreshTokens");
      return res.status(200).json(users);   
    } else {
      const users = await userModel.find().select("-password -refreshTokens");
      return res.status(200).json(users);
    }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id).select("-password -refreshTokens");
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err: any) {
        res.status(500).send('Error retrieving user');
    }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      refreshTokens: [],
    });

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = { ...req.body };
  delete updatedData.refreshTokens;
  try {
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, { new: true }).select("-password -refreshTokens");
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json(updatedUser);
    } catch (err: any) {
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({
          _id: deletedUser._id,
          username: deletedUser.username,
          email: deletedUser.email,
        });
    } catch (err: any) {
        res.status(500).send('Error deleting user');
    }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
