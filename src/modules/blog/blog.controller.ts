
import { Request, Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { blogParamsSchema, blogSlugSchema, createBlogSchema, updateBlogSchema } from "./blog.schema";
import { blogService } from "./blog.service";
import { AppError } from "../../utils/AppError";
import { ZodError } from "zod";



export class BlogController {


  getAllPublishedBlogs = catchAsync(async (req: Request, res: Response) => {
    const blogs = await blogService.getAllPublishedBlogs();
    
    res.json({
      success: true,
      data: blogs,
      message: 'Blogs fetched successfully'
    });
  });

  createBlog = catchAsync<AuthRequest>(async (req, res) => {

    const { body } = createBlogSchema.parse({ body: req.body });

    const authorId = req.user!.id;

    const blog = await blogService.createBlog(body, authorId);

    res.status(201).json({
      success: true,
      data: blog,
      message: "Blog created successfully",
    });
  });
  updateBlog = catchAsync(async (req: AuthRequest, res: Response) => {
    
    const { params, body } = updateBlogSchema.parse(req);
    const { id } = params;

    const blog = await blogService.updateBlog(id, body);

    res.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });
  });

  deleteBlog = catchAsync(async (req: AuthRequest, res: Response) => {
    // Validate request params
    const { params } = blogParamsSchema.parse(req);
    const { id } = params;

    await blogService.deleteBlog(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  });

   getAllBlogs = catchAsync(async (req: AuthRequest, res: Response) => {
    const blogs = await blogService.getAllBlogs();
    
    res.json({
      success: true,
      data: blogs,
      message: 'All blogs fetched successfully'
    });
  });
  
   async getBlogBySlug(req: Request, res: Response) {
    try {
      // Validate request params
      const { params } = blogSlugSchema.parse(req);
      const { slug } = params;

      const blog = await blogService.getBlogBySlug(slug);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      if (!blog.published) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      res.json({
        success: true,
        data: blog,
        message: 'Blog fetched successfully'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid slug parameter',
          errors: error
        });
      }

      console.error('Get blog by slug error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }


  getBlogById = catchAsync(async (req: AuthRequest, res: Response) => {
    
    const { params } = blogParamsSchema.parse(req);
    const { id } = params;

    const blog = await blogService.getBlogById(id);

    if (!blog) {
      throw AppError.notFound('Blog not found');
    }

    res.json({
      success: true,
      data: blog,
      message: 'Blog fetched successfully'
    });
  });



}

export const blogController = new BlogController();