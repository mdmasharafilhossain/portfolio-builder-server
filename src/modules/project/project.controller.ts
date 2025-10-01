// src/controllers/project.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { projectService } from './project.service';
import { createProjectSchema, projectParamsSchema, updateProjectSchema } from './project.schema';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../types';


export class ProjectController {
  
  getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const projects = await projectService.getAllProjects();
    
    res.json({
      success: true,
      data: projects,
      message: 'Projects fetched successfully',
      count: projects.length
    });
  });

 
  getFeaturedProjects = catchAsync(async (req: Request, res: Response) => {
    const projects = await projectService.getFeaturedProjects();
    
    res.json({
      success: true,
      data: projects,
      message: 'Featured projects fetched successfully',
      count: projects.length
    });
  });

 
  getProjectById = catchAsync(async (req: Request, res: Response) => {
    const { params } = projectParamsSchema.parse(req);
    const { id } = params;

    const project = await projectService.getProjectById(id);

    if (!project) {
      throw AppError.notFound('Project not found');
    }

    res.json({
      success: true,
      data: project,
      message: 'Project fetched successfully'
    });
  });

 
  getProjectsByTechnology = catchAsync(async (req: Request, res: Response) => {
    const { technology } = req.params;

    if (!technology) {
      throw AppError.badRequest('Technology parameter is required');
    }

    const projects = await projectService.getProjectsByTechnology(technology);
    
    res.json({
      success: true,
      data: projects,
      message: `Projects with technology '${technology}' fetched successfully`,
      count: projects.length
    });
  });

  
  getAllTechnologies = catchAsync(async (req: Request, res: Response) => {
    const technologies = await projectService.getAllTechnologies();
    
    res.json({
      success: true,
      data: technologies,
      message: 'Technologies fetched successfully',
      count: technologies.length
    });
  });

 
  createProject = catchAsync(async (req: AuthRequest, res: Response) => {
    const { body } = createProjectSchema.parse(req);

    const project = await projectService.createProject(body);

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  });

 
  updateProject = catchAsync(async (req: AuthRequest, res: Response) => {
    const { params, body } = updateProjectSchema.parse(req);
    const { id } = params;

    const project = await projectService.updateProject(id, body);

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  });

 
  deleteProject = catchAsync(async (req: AuthRequest, res: Response) => {
    const { params } = projectParamsSchema.parse(req);
    const { id } = params;

    await projectService.deleteProject(id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  });

  /**
   * Toggle project featured status (admin only)
   */
  toggleFeatured = catchAsync(async (req: AuthRequest, res: Response) => {
    const { params } = projectParamsSchema.parse(req);
    const { id } = params;

    const project = await projectService.toggleFeatured(id);

    res.json({
      success: true,
      data: project,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`
    });
  });
}

export const projectController = new ProjectController();