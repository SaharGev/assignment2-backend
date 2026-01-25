//routes/postRoutes.ts
import { Router } from 'express';
import postController from '../controllers/postControllers';
import { authenticate } from '../middleware/authMiddleware';
const router = Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticate, postController.createNewPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.get('/:postId/comments', postController.getCommentsByPostId);

export default router;