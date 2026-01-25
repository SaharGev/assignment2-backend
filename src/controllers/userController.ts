//controllers/userController.ts
import { Request, Response } from 'express';
import userModel from '../model/userModel';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string | undefined;
    const email = req.query.email as string | undefined;
    if (username) {
      const users = await userModel.find({ username: username });
      return res.status(200).json(users);
    } else if (email) {
      const users = await userModel.find({ email: email });
      return res.status(200).json(users);   
    } else {
      const users = await userModel.find();
      res.status(200).json(users);
    }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err: any) {
        res.status(500).send('Error retrieving user');
    }
};

const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    try {
        const newUser = await userModel.create(user);
        res.status(201).json(newUser);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (err: any) {
        res.status(500).send('Error updating user');
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(deletedUser);
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
