
import express from 'express';
import { authController } from './auth.controller';
import { authenticateToken } from '../../middleware/auth';


const router = express.Router();


router.post('/login', authController.login);
router.post('/register',  authController.register); 

// Protected routes (require authentication)
// router.use(authenticateToken);

router.get('/profile',authenticateToken, authController.getProfile);
// router.put('/profile', authController.updateProfile);
// router.put('/change-password', authController.changePassword);
router.get('/verify', authenticateToken,authController.verifyToken);
router.post('/logout', authController.logout);

// // Admin only routes
// router.post('/admin/register', requireAdmin, adminRateLimit, authController.register);

export default router;