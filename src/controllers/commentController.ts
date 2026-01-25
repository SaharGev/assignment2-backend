//controllers/commentController.ts
import { Request, Response } from 'express';
import commentModel from "../model/commentModel";
import mongoose from 'mongoose';

// Get all comments by Post ID
const getCommentsByPostId = async (req: Request, res: Response) => {
    const postId  = req.query.postId as string | undefined; 
    try {
        let comments;
        if (postId && mongoose.Types.ObjectId.isValid(postId)) {
            comments = await commentModel.find({ postId: postId });
        } else {
            comments = await commentModel.find();
        }

        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get comment by ID
const getCommentById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const comment = await commentModel.findById(id);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }   
        res.json(comment);
    } catch (err) {
        res.status(500).send('Error retrieving comment');
    }       
};

// Create a new comment
const createComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { postId, content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ message: "postId and content are required" });
    }

    const newComment = await commentModel.create({
      postId,
      content,
      sender: userId,
    });

    res.status(201).json(newComment);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a comment 
const deleteComment = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deleted = await commentModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send('Comment not found');
        // res.send('Comment deleted');
        res.status(200).json(deleted);
    } catch (err: any) {
        res.status(500).send('Error deleting comment');
    }
};

//Update a comment
const updateComment = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData.sender;
    delete updatedData.postId;
    try {
        const updatedComment = await commentModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedComment) {
            return res.status(404).send('Comment not found');
        }   
        res.json(updatedComment);
    } catch (err: any) {
        res.status(500).send('Error updating comment');
    }
};



export default {
    createComment,
    getCommentById,
    deleteComment,
    updateComment,
    getCommentsByPostId
};
