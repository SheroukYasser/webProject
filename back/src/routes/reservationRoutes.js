// routes/reservationRoutes.js
import express from 'express';
import reservationController from '../controllers/reservationController.js';
import { authenticate, authenticateWithSession, isMember , isLibrarian} from '../middleware/authMiddleware.js';

const router = express.Router();

// Create reservation - Members only, modifies DB
router.post('/', 
  authenticateWithSession,  // Enhanced security for creating records
  isMember,                 // Only members can create reservations
  reservationController.createReservation
);
router.get('/all-reservations-admin', authenticateWithSession, isLibrarian, reservationController.getAllReservationsForAdmin);

// Get reservations - Read-only, filtered by role in controller
router.get('/', 
  authenticate,  // Basic auth is sufficient for viewing
  reservationController.getMyReservations
);

// Cancel reservation - Members only, modifies DB
router.put('/:id/cancel', 
  authenticateWithSession,  // Enhanced security for modifications
  isMember,                 // Only members can cancel
  reservationController.cancelReservation
);
router.post('/notify/:book_id', reservationController.notifyReservations);


export default router;