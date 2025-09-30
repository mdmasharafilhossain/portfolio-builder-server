// src/routes/blog.routes.ts
import express from 'express';
import { blogController } from './blog.controller';



const router = express.Router();



router.post('/', blogController.createBlog);


export default router;