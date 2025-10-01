
import {  Project } from '@prisma/client';
import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { CreateProjectInput, UpdateProjectInput } from './project.schema';



export class ProjectService {
  
  async getAllProjects(): Promise<Project[]> {
    try {
      return await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch projects');
    }
  }

 
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      return await prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch featured projects');
    }
  }


  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await prisma.project.findUnique({
        where: { id }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch project');
    }
  }

 
  async createProject(data: CreateProjectInput): Promise<Project> {
    try {
      // Check if project with same title already exists
      const existingProject = await prisma.project.findFirst({
        where: { title: data.title }
      });

      if (existingProject) {
        throw AppError.conflict('Project with this title already exists');
      }

      return await prisma.project.create({
        data: {
          ...data,
          technologies: data.technologies || []
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to create project');
    }
  }


  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    try {
      
      const existingProject = await this.getProjectById(id);
      if (!existingProject) {
        throw AppError.notFound('Project not found');
      }

    
      if (data.title && data.title !== existingProject.title) {
        const projectWithTitle = await prisma.project.findFirst({
          where: {
            title: data.title,
            NOT: { id }
          }
        });

        if (projectWithTitle) {
          throw AppError.conflict('Another project with this title already exists');
        }
      }

      return await prisma.project.update({
        where: { id },
        data: {
          ...data,
          technologies: data.technologies || existingProject.technologies
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to update project');
    }
  }

 
  async deleteProject(id: string): Promise<void> {
    try {
     
      const existingProject = await this.getProjectById(id);
      if (!existingProject) {
        throw AppError.notFound('Project not found');
      }

      await prisma.project.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to delete project');
    }
  }

 
  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    try {
      return await prisma.project.findMany({
        where: {
          technologies: {
            has: technology
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw AppError.internalError('Failed to fetch projects by technology');
    }
  }

 
  async getAllTechnologies(): Promise<string[]> {
    try {
      const projects = await prisma.project.findMany({
        select: { technologies: true }
      });

      const technologies = projects.flatMap(project => project.technologies);
      return [...new Set(technologies)]; // Remove duplicates
    } catch (error) {
      throw AppError.internalError('Failed to fetch technologies');
    }
  }

 
  async toggleFeatured(id: string): Promise<Project> {
    try {
      const project = await this.getProjectById(id);
      if (!project) {
        throw AppError.notFound('Project not found');
      }

      return await prisma.project.update({
        where: { id },
        data: { featured: !project.featured }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to toggle featured status');
    }
  }
}

export const projectService = new ProjectService();