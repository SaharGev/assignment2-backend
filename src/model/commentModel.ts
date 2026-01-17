//models/commentModel.ts
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
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

export default mongoose.model('comment', commentSchema);