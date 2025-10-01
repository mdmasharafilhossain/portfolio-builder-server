
import { PrismaClient } from '@prisma/client';
import { AboutWithRelations, CreateAboutInput, UpdateAboutInput } from './about.schema';
import { AppError } from '../../utils/AppError';


const prisma = new PrismaClient();



export class AboutService {
  
  async getAbout(): Promise<AboutWithRelations | null> {
    try {
      const about = await prisma.about.findFirst();
      
      if (!about) {
        return null;
      }

      // Parse JSON fields
      return {
        ...about,
        socialLinks: about.socialLinks ? JSON.parse(about.socialLinks as any) : [],
        skills: about.skills ? JSON.parse(about.skills as any) : [],
        experiences: about.experiences ? JSON.parse(about.experiences as any) : []
      };
    } catch (error) {
      throw AppError.internalError('Failed to fetch about information');
    }
  }

 
  async createAbout(data: CreateAboutInput): Promise<AboutWithRelations> {
    try {
      // Check if about already exists
      const existingAbout = await prisma.about.findFirst();
      if (existingAbout) {
        throw AppError.conflict('About information already exists');
      }

      const about = await prisma.about.create({
        data: {
          ...data,
          socialLinks: JSON.stringify(data.socialLinks || []),
          skills: JSON.stringify(data.skills || []),
          experiences: JSON.stringify(data.experiences || [])
        }
      });

      // Parse JSON fields for response
      return {
        ...about,
        socialLinks: data.socialLinks || [],
        skills: data.skills || [],
        experiences: data.experiences || []
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to create about information');
    }
  }

  
  async updateAbout(data: UpdateAboutInput): Promise<AboutWithRelations> {
    try {
      // Get existing about
      const existingAbout = await prisma.about.findFirst();
      if (!existingAbout) {
        throw AppError.notFound('About information not found');
      }

      // Merge existing data with updates
      const currentData = {
        socialLinks: existingAbout.socialLinks ? JSON.parse(existingAbout.socialLinks as any) : [],
        skills: existingAbout.skills ? JSON.parse(existingAbout.skills as any) : [],
        experiences: existingAbout.experiences ? JSON.parse(existingAbout.experiences as any) : []
      };

      const updatedData = {
        ...data,
        socialLinks: data.socialLinks || currentData.socialLinks,
        skills: data.skills || currentData.skills,
        experiences: data.experiences || currentData.experiences
      };

      const about = await prisma.about.update({
        where: { id: existingAbout.id },
        data: {
          ...updatedData,
          socialLinks: JSON.stringify(updatedData.socialLinks),
          skills: JSON.stringify(updatedData.skills),
          experiences: JSON.stringify(updatedData.experiences)
        }
      });

      // Parse JSON fields for response
      return {
        ...about,
        socialLinks: updatedData.socialLinks,
        skills: updatedData.skills,
        experiences: updatedData.experiences
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to update about information');
    }
  }

  
  async upsertAbout(data: CreateAboutInput): Promise<AboutWithRelations> {
    try {
      const existingAbout = await prisma.about.findFirst();

      if (existingAbout) {
        return await this.updateAbout(data);
      } else {
        return await this.createAbout(data);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to upsert about information');
    }
  }


  async deleteAbout(): Promise<void> {
    try {
      const existingAbout = await prisma.about.findFirst();
      if (!existingAbout) {
        throw AppError.notFound('About information not found');
      }

      await prisma.about.delete({
        where: { id: existingAbout.id }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to delete about information');
    }
  }


  async addSocialLink(socialLink: any): Promise<AboutWithRelations> {
    try {
      const existingAbout = await this.getAbout();
      if (!existingAbout) {
        throw AppError.notFound('About information not found');
      }

      const updatedSocialLinks = [...existingAbout.socialLinks, socialLink];

      return await this.updateAbout({
        socialLinks: updatedSocialLinks
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to add social link');
    }
  }

  
  async addSkill(skill: any): Promise<AboutWithRelations> {
    try {
      const existingAbout = await this.getAbout();
      if (!existingAbout) {
        throw AppError.notFound('About information not found');
      }

      const updatedSkills = [...existingAbout.skills, skill];

      return await this.updateAbout({
        skills: updatedSkills
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to add skill');
    }
  }


  async addExperience(experience: any): Promise<AboutWithRelations> {
    try {
      const existingAbout = await this.getAbout();
      if (!existingAbout) {
        throw AppError.notFound('About information not found');
      }

      const updatedExperiences = [...existingAbout.experiences, experience];

      return await this.updateAbout({
        experiences: updatedExperiences
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to add experience');
    }
  }

 
  async getSkillsByCategory(category: string): Promise<any[]> {
    try {
      const about = await this.getAbout();
      if (!about) {
        return [];
      }

      return about.skills.filter(skill => skill.category === category);
    } catch (error) {
      throw AppError.internalError('Failed to fetch skills by category');
    }
  }

  
  async getCurrentExperiences(): Promise<any[]> {
    try {
      const about = await this.getAbout();
      if (!about) {
        return [];
      }

      return about.experiences.filter(exp => exp.current);
    } catch (error) {
      throw AppError.internalError('Failed to fetch current experiences');
    }
  }
}

export const aboutService = new AboutService();