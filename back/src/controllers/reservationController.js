import reservationService from '../services/reservationService.js';

class ReservationController {
    async createReservation(req, res, next) {
        try {
            const reservation = await reservationService.createReservation(req.body);
            res.status(201).json({ success: true, data: reservation });
        } catch (error) {
            next(error);
        }
    }

    async getReservations(req, res, next) {
        try {
            const reservations = await reservationService.getReservations();
            res.status(200).json({ success: true, data: reservations });
        } catch (error) {
            next(error);
        }
    }

    async cancelReservation(req, res, next) {
        try {
            const reservation = await reservationService.cancelReservation(req.params.id);
            res.status(200).json({ success: true, data: reservation, message: 'Reservation cancelled' });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReservationController();
