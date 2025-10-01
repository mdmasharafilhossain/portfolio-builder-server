// src/routes/blog.routes.ts
import express from 'express';
import { blogController } from './blog.controller';
import { authenticateToken, requireAdmin, verifyToken } from '../../middleware/auth';



const router = express.Router();


router.get('/', blogController.getAllPublishedBlogs);
router.use(authenticateToken, requireAdmin);
router.post('/',authenticateToken,blogController.createBlog);

router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

// Admin only routes for management
router.get('/admin/all', blogController.getAllBlogs);
router.get('/admin/:id', blogController.getBlogById);

export default router;