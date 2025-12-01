import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import reservationModel from '../models/Reservation.js';
import bookModel from '../models/Books.js';

const Reservation = reservationModel(sequelize, DataTypes);
const Book = bookModel(sequelize, DataTypes);


class ReservationService {
    async createReservation(reservationData) {
        const { member_id, book_id } = reservationData;

        // Start a transaction
        const t = await sequelize.transaction();

        try {
            const book = await Book.findByPk(book_id, { transaction: t });
            if (!book) {
                throw new Error('Book not found');
            }

            if (book.available_copies <= 0) {
                throw new Error('No copies available');
            }

            // Decrement available copies
            await book.update({ available_copies: book.available_copies - 1 }, { transaction: t });

            // Create reservation
            const reservation = await Reservation.create({
                member_id,
                book_id,
                status: 'pending'
            }, { transaction: t });

            await t.commit();
            return reservation;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getReservations() {
        return await Reservation.findAll();
    }

    async cancelReservation(id) {
        const t = await sequelize.transaction();

        try {
            const reservation = await Reservation.findByPk(id, { transaction: t });
            if (!reservation) {
                throw new Error('Reservation not found');
            }

            if (reservation.status === 'cancelled') {
                throw new Error('Reservation already cancelled');
            }

            // Update reservation status
            await reservation.update({ status: 'cancelled' }, { transaction: t });

            // Increment book available copies
            const book = await Book.findByPk(reservation.book_id, { transaction: t });
            if (book) {
                await book.update({ available_copies: book.available_copies + 1 }, { transaction: t });
            }

            await t.commit();
            return reservation;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new ReservationService();
