
import express from 'express';
import { projectController } from './project.controller';
import { authenticateToken, requireAdmin } from '../../middleware/auth';


const router = express.Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/technologies', projectController.getAllTechnologies);
router.get('/technology/:technology', projectController.getProjectsByTechnology);
router.get('/:id', projectController.getProjectById);
// router.use(authenticateToken, requireAdmin);


// Project management routes
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.patch('/:id/featured', projectController.toggleFeatured);

export default router;