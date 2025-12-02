// routes/profileRoutes.js
import express from 'express';
import ProfileController from '../controllers/memberController.js';
import { authenticate, authenticateWithSession } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Get user profile
 * GET /api/profile
 * Works for both members and librarians
 */
router.get('/', 
  authenticate,  // Read-only operation - fast
  ProfileController.getProfile
);

/**
 * Update user profile
 * PUT /api/profile
 * - Members can update: full_name, email, phone
 * - Librarians can update: full_name, email
 */
router.patch('/update', 
  authenticateWithSession,  // Modifies data - enhanced security
  ProfileController.updateProfile
);

/**
 * Change password
 * PUT /api/profile/change-password
 * Works for both members and librarians
 */
router.put('/change-password', 
  authenticateWithSession,  // Sensitive operation - enhanced security
  ProfileController.changePassword
);

export default router;