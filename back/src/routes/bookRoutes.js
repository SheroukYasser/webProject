import express from 'express';
import bookController from '../controllers/bookController.js';
import { authenticate, isLibrarian } from '../middleware/authMiddleware.js';

const router = express.Router();

// ----------------------------------------------
// PUBLIC ROUTES (anyone can view)
// ----------------------------------------------
router.get('/',authenticate, bookController.getAllBooks);
router.get('/:id',authenticate, bookController.getBookById);

// ----------------------------------------------
// LIBRARIAN-ONLY ROUTES
// ----------------------------------------------
router.post('/', authenticate, isLibrarian, bookController.createBook);
router.put('/:id', authenticate, isLibrarian, bookController.updateBook);
router.delete('/:id', authenticate, isLibrarian, bookController.deleteBook);

export default router;
