//controllers/postControllers.ts
import { Request, Response } from 'express';
import postModel from "../model/postModel";
import commentModel from '../model/commentModel';
import mongoose from 'mongoose';


const getAllPosts = async (req: Request, res:Response) => {
    try {
        const sender = req.query.sender as string | undefined;
        if (sender && mongoose.Types.ObjectId.isValid(sender)) {
      const posts = await postModel.find({ sender });
      return res.status(200).json(posts);
    }

    const posts = await postModel.find();
    res.status(200).json(posts);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const getPostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);  
        if (!post) {
            return res.status(404).send('post not found');
        }
        res.json(post);
    } catch (err: any) {
        console.error(err);
        res.status(500).send('error getting post by id');
    }  
}; 

const createNewPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newPost = await postModel.create({
      title,
      content,
      sender: userId,
    });

    res.status(201).json(newPost);
    } catch (err: any) {
        res.status(500).send("Error creating post");
    }
};

const updatePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData.sender;  
    try {
        const updatedPost = await postModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }   
        res.json(updatedPost);
    } catch (err: any) {
        res.status(500).send('Error updating post');
    }
};

const getCommentsByPostId = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const comments = await commentModel.find({ postId: postId });
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }   
};

const deletePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedPost = await postModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }
        res.json(deletedPost);
    } catch (err: any) {
        res.status(500).send('Error deleting post');
    }
};

export default {
    getAllPosts,
    getPostById,
    createNewPost,
    updatePost,
    getCommentsByPostId,
    deletePost
};
