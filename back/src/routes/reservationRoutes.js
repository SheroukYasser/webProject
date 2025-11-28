import express from 'express';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.put('/:id/cancel', reservationController.cancelReservation);

export default router;
