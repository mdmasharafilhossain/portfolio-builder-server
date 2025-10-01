// src/routes/blog.routes.ts
import express from 'express';
import { blogController } from './blog.controller';
import { authenticateToken, verifyToken } from '../../middleware/auth';



const router = express.Router();



router.post('/',authenticateToken,blogController.createBlog);


export default router;