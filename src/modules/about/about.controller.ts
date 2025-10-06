
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { aboutService } from './about.service';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../types';
import { createAboutSchema, updateAboutSchema } from './about.schema';


export class AboutController {
  
  getAbout = catchAsync(async (req: Request, res: Response) => {
    const about = await aboutService.getAbout();

    if (!about) {
      throw AppError.notFound('About information not found');
    }

    res.json({
      success: true,
      data: about,
      message: 'About information fetched successfully'
    });
  });

  
  createAbout = catchAsync(async (req: AuthRequest, res: Response) => {
    const  body  = createAboutSchema.parse(req.body);

    const about = await aboutService.createAbout(body);

    res.status(201).json({
      success: true,
      data: about,
      message: 'About information created successfully'
    });
  });

  
  updateAbout = catchAsync(async (req: AuthRequest, res: Response) => {
    const  body = updateAboutSchema.parse(req.body);

    const about = await aboutService.updateAbout(body);

    res.json({
      success: true,
      data: about,
      message: 'About information updated successfully'
    });
  });

  
  upsertAbout = catchAsync(async (req: AuthRequest, res: Response) => {
    const body = createAboutSchema.parse(req.body);

    const about = await aboutService.upsertAbout(body);

    res.json({
      success: true,
      data: about,
      message: 'About information upserted successfully'
    });
  });

 
  deleteAbout = catchAsync(async (req: AuthRequest, res: Response) => {
    await aboutService.deleteAbout();

    res.json({
      success: true,
      message: 'About information deleted successfully'
    });
  });

  
  addSocialLink = catchAsync(async (req: AuthRequest, res: Response) => {
    const socialLink = req.body;

    if (!socialLink.platform || !socialLink.url) {
      throw AppError.badRequest('Platform and URL are required');
    }

    const about = await aboutService.addSocialLink(socialLink);

    res.status(201).json({
      success: true,
      data: about,
      message: 'Social link added successfully'
    });
  });

  
  addSkill = catchAsync(async (req: AuthRequest, res: Response) => {
    const skill = req.body;

    if (!skill.name || !skill.category) {
      throw AppError.badRequest('Name and category are required');
    }

    const about = await aboutService.addSkill(skill);

    res.status(201).json({
      success: true,
      data: about,
      message: 'Skill added successfully'
    });
  });

  /**
   * Add experience (admin only)
   */
  addExperience = catchAsync(async (req: AuthRequest, res: Response) => {
    const experience = req.body;

    if (!experience.company || !experience.position || !experience.startDate) {
      throw AppError.badRequest('Company, position, and start date are required');
    }

    const about = await aboutService.addExperience(experience);

    res.status(201).json({
      success: true,
      data: about,
      message: 'Experience added successfully'
    });
  });

 
  getSkillsByCategory = catchAsync(async (req: Request, res: Response) => {
    const { category } = req.params;

    if (!category) {
      throw AppError.badRequest('Category parameter is required');
    }

    const skills = await aboutService.getSkillsByCategory(category);

    res.json({
      success: true,
      data: skills,
      message: `Skills in category '${category}' fetched successfully`,
      count: skills.length
    });
  });

 
  getCurrentExperiences = catchAsync(async (req: Request, res: Response) => {
    const experiences = await aboutService.getCurrentExperiences();

    res.json({
      success: true,
      data: experiences,
      message: 'Current experiences fetched successfully',
      count: experiences.length
    });
  });

 
  getAboutSummary = catchAsync(async (req: Request, res: Response) => {
    const about = await aboutService.getAbout();

    if (!about) {
      throw AppError.notFound('About information not found');
    }

    // Return only essential information
    const summary = {
      id: about.id,
      name: about.name,
      title: about.title,
      bio: about.bio,
      avatarUrl: about.avatarUrl,
      socialLinks: about.socialLinks
    };

    res.json({
      success: true,
      data: summary,
      message: 'About summary fetched successfully'
    });
  });
}

export const aboutController = new AboutController();