import { Blog } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../config/db";
import { CreateBlogInput } from "./blog.schema";

export interface BlogWithAuthor extends Blog {
author: {
    name: string
}
}
export class BlogService {

// For Create Blog 
async createBlog(data: CreateBlogInput, authorId: string): Promise<BlogWithAuthor> {
    try {
      // Check if slug already exists
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: data.slug }
      });

      if (existingBlog) {
        throw AppError.conflict('Blog with this slug already exists');
      }

      return await prisma.blog.create({
        data: {
          ...data,
          authorId,
        },
        include: { 
          author: { 
            select: { 
              name: true 
            } 
          } 
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to create blog');
    }
  }



  }


  export const blogService = new BlogService();