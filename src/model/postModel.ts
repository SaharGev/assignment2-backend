//models/postModel.ts
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sender: {
        type: Number,
        required: true
    },
    createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('post', postSchema);