
import { AppError } from "../../utils/AppError";
import { prisma } from "../../config/db";
import { BlogWithAuthor, CreateBlogInput, UpdateBlogInput } from "./blog.schema";


export class BlogService {

// For Create Blog 
async createBlog(data: CreateBlogInput, authorId: string): Promise<BlogWithAuthor> {
    try {
      
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
async getBlogBySlug(slug: string): Promise<BlogWithAuthor | null> {
    try {
      return await prisma.blog.findUnique({
        where: { slug },
        include: { 
          author: { 
            select: { 
              name: true 
            } 
          } 
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
async getAllPublishedBlogs(): Promise<BlogWithAuthor[]> {
    try {
      return await prisma.blog.findMany({
        where: { published: true },
        include: { 
          author: { 
            select: { 
              name: true 
            } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch blogs');
    }
  }
async getBlogById(id: string): Promise<BlogWithAuthor | null> {
    try {
      return await prisma.blog.findUnique({
        where: { id },
        include: { 
          author: { 
            select: { 
              name: true 
            } 
          } 
        }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch blog');
    }
  }
  async updateBlog(id: string, data: UpdateBlogInput): Promise<BlogWithAuthor> {
    try {
      
      const existingBlog = await this.getBlogById(id);
      if (!existingBlog) {
        throw AppError.notFound('Blog not found');
      }

      
      if (data.slug && data.slug !== existingBlog.slug) {
        const blogWithSlug = await prisma.blog.findFirst({
          where: {
            slug: data.slug,
            NOT: { id }
          }
        });

        if (blogWithSlug) {
          throw AppError.conflict('Another blog with this slug already exists');
        }
      }

      return await prisma.blog.update({
        where: { id },
        data,
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
      throw AppError.internalError('Failed to update blog');
    }
  }
  async getAllBlogs(): Promise<BlogWithAuthor[]> {
    try {
      return await prisma.blog.findMany({
        include: { 
          author: { 
            select: { 
              name: true 
            } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch blogs');
    }
  }
    async deleteBlog(id: string): Promise<void> {
    try {
      
      const existingBlog = await this.getBlogById(id);
      if (!existingBlog) {
        throw AppError.notFound('Blog not found');
      }

      await prisma.blog.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to delete blog');
    }
  }
  }


  export const blogService = new BlogService();