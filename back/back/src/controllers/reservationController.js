import reservationService from '../services/reservationService.js';

class ReservationController {
    async createReservation(req, res, next) {
        try {
            // Take member_id from JWT token
            const member_id = req.user.userId;
            const { book_id } = req.body;

            const reservation = await reservationService.createReservation({ member_id, book_id });
            res.status(201).json({ success: true, data: reservation });
        } catch (error) {
            next(error);
        }
    }


    async getMyReservations(req, res, next) {
        try {
            const member_id = req.user.userId;
            const reservations = await reservationService.getReservationsByMember(member_id);
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
    async getAllReservationsForAdmin(req, res, next) {
        try {
            const reservations = await reservationService.getAllReservationsWithMembers();
            return res.status(200).json({
                success: true,
                data: reservations
            });
        } catch (error) {
            next(error);
        }
    }
    async notifyReservations(req, res) {
        try {
            const { book_id } = req.params;
            const result = await reservationService.notifyNextReservations(Number(book_id));

            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    sent: result.sent,
                    failed: result.failed,
                    errors: result.errors || []
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getReservationsByUserId(req, res) {
    try {
      const { userId } = req.params;

      const reservations = await reservationService.getReservationsByUserIdForLibrarian(userId);

      return res.json({
        success: true,
        reservations
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}

export default new ReservationController();
