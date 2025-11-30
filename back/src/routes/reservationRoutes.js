// routes/reservationRoutes.js
import express from 'express';
import reservationController from '../controllers/reservationController.js';
import { authenticate, authenticateWithSession, isMember } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create reservation - Members only, modifies DB
router.post('/', 
  authenticateWithSession,  // Enhanced security for creating records
  isMember,                 // Only members can create reservations
  reservationController.createReservation
);

// Get reservations - Read-only, filtered by role in controller
router.get('/', 
  authenticate,  // Basic auth is sufficient for viewing
  reservationController.getReservations
);

// Cancel reservation - Members only, modifies DB
router.put('/:id/cancel', 
  authenticateWithSession,  // Enhanced security for modifications
  isMember,                 // Only members can cancel
  reservationController.cancelReservation
);

export default router;