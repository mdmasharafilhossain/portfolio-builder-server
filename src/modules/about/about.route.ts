
import express from 'express';
import { aboutController } from './about.controller';
import { authenticateToken, requireAdmin } from '../../middleware/auth';


const router = express.Router();

// Public routes
router.get('/', aboutController.getAbout);
router.get('/summary', aboutController.getAboutSummary);
router.get('/skills/:category', aboutController.getSkillsByCategory);
router.get('/experiences/current', aboutController.getCurrentExperiences);
router.use(authenticateToken, requireAdmin);


// About management routes
router.get('/', aboutController.getAbout);
router.post('/', aboutController.createAbout);
router.put('/', aboutController.updateAbout);
router.patch('/', aboutController.upsertAbout);
router.delete('/', aboutController.deleteAbout);

// Social links management
router.post('/social-links', aboutController.addSocialLink);

// Skills management
router.post('/skills', aboutController.addSkill);

// Experiences management
router.post('/experiences', aboutController.addExperience);
export default router;