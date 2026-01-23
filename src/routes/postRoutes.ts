//routes/postRoutes.ts
import { Router } from 'express';
import postController from '../controllers/postControllers';
const router = Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createNewPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/:postId/comments', postController.getCommentsByPostId);

export default router;