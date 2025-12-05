// routes/fineRoutes.js
import express from 'express';
import fineController from '../controllers/fineController.js';
import {
    authenticate,
    authenticateWithSession,
    isLibrarian,
    isMember,
    authorize
} from '../middleware/authMiddleware.js'

const router = express.Router();
// Librarian Routes - Enhanced authentication with session validation
router.get('/', authenticateWithSession, isLibrarian, fineController.getAllFines);
router.put('/pay/:fine_id', authenticateWithSession, isLibrarian, fineController.payFine);
router.get('/report/summary', authenticateWithSession, isLibrarian, fineController.getFineReport);

// Member Routes - Basic authentication
router.get('/member/:member_id/unpaid', authenticate, isMember, fineController.getMemberUnpaidFines);
router.get('/member/:member_id/history', authenticate, isMember, fineController.getMemberFineHistory);

// Both Member and Librarian - Basic authentication
router.get('/:fine_id', authenticate, authorize('member', 'librarian'), fineController.getFineById);

export default router;