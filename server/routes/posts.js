import express from 'express';
// import { verifyToken } from '../middleware/authVerify.js';
import { getFeedPosts,getUserPosts,likePosts } from '../controllers/posts.js';

const router = express.Router();

//READ
router.get('/',getFeedPosts);
router.get('/:userId/posts',getUserPosts);

//UPDATE
router.patch('/:id/like',likePosts);

export default router;