
import express from 'express';
import { aboutController } from './about.controller';
import { authenticateToken, requireAdmin } from '../../middleware/auth';


const router = express.Router();


router.get('/', aboutController.getAbout);
router.get('/summary', aboutController.getAboutSummary);
router.get('/skills/:category', aboutController.getSkillsByCategory);
router.get('/experiences/current', aboutController.getCurrentExperiences);
router.use(authenticateToken, requireAdmin);



router.get('/', aboutController.getAbout);
router.post('/', aboutController.createAbout);
router.put('/', aboutController.updateAbout);
router.patch('/', aboutController.upsertAbout);
router.delete('/', aboutController.deleteAbout);


router.post('/social-links', aboutController.addSocialLink);


router.post('/skills', aboutController.addSkill);


router.post('/experiences', aboutController.addExperience);
export default router;