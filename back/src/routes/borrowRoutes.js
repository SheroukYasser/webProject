import express from 'express';
import borrowingController from '../controllers/borrowController.js';
import {
    authenticate,
    authenticateWithSession,
    isLibrarian,
    isMember,
    authorize
} from '../middleware/authMiddleware.js'

const router = express.Router();

// Member Routes - Fast authentication (no DB query)
router.post('/borrow', authenticate, isMember, borrowingController.borrowBook);

// Librarian Routes - Enhanced authentication with session validation
router.put('/return/:borrowing_id', authenticateWithSession, isLibrarian, borrowingController.returnBook);
router.put('/update-overdue', authenticateWithSession, isLibrarian, borrowingController.updateOverdueStatus);

// Both Member and Librarian - Basic authentication
router.get('/', authenticate, authorize('member', 'librarian'), borrowingController.getAllBorrowings);
router.get('/:borrowing_id', authenticate, authorize('member', 'librarian'), borrowingController.getBorrowingById);

// Member can view their own history
router.get('/member/:member_id/history', authenticate, borrowingController.getMemberHistory);

export default router;

