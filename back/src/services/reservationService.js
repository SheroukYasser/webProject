import sequelize from '../config/db.js';
import { DataTypes, Op } from 'sequelize';
import reservationModel from '../models/Reservation.js';
import bookModel from '../models/Books.js';
import memberModel from '../models/Member.js';
import nodemailer from 'nodemailer';

const Reservation = reservationModel(sequelize, DataTypes);
const Book = bookModel(sequelize, DataTypes);
const Member = memberModel(sequelize, DataTypes);
// Add associations for eager loading (only once)
Reservation.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Reservation, { foreignKey: "member_id" });
Reservation.belongsTo(Book, { foreignKey: 'book_id' });

// Define associations if not already defined in models (they seem to have foreign keys but maybe not associations)
// Ideally associations should be in models or a central place, but for now I'll use them here or just rely on IDs.
// The models have `references` in definition, but Sequelize associations (belongsTo, hasMany) are better for eager loading.
// I will stick to simple ID based logic for now to avoid complexity if associations aren't set up.

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

        // Reservation can be created even if no copies are available
        const reservation = await Reservation.create({
            member_id,
            book_id,
            status: 'pending' // maybe change to 'waiting' if you like
        }, { transaction: t });

        await t.commit();
        return reservation;

    } catch (error) {
        await t.rollback();
        throw error;
    }
}


    async getReservationsByMember(member_id) {
    return await Reservation.findAll({
      where: {
        member_id,
        status: { [Op.ne]: 'cancelled' } // exclude cancelled
      },
      include: [
        { model: Book, attributes: ['title', 'author'] }
      ],
      order: [['reservation_date', 'DESC']]
    });
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

        

        await t.commit();
        return reservation;

    } catch (error) {
        await t.rollback();
        throw error;
    }
}

    async getAllReservationsWithMembers() {
    return await Reservation.findAll({
      where: {
        status: { [Op.ne]: 'cancelled' } // exclude cancelled
      },
      include: [
        {
          model: Member,
          attributes: ['full_name', 'email', 'phone'] // member info
        },
        {
          model: Book,
          attributes: ['title', 'author'] // book info
        }
      ],
      order: [['reservation_date', 'DESC']]
    });
  }
async notifyNextReservations(book_id) {
        try {
            // Get book details
            const book = await Book.findByPk(book_id);
            if (!book) {
                throw new Error('Book not found');
            }

            if (book.available_copies <= 0) {
                return {
                    success: true,
                    message: 'No available copies to notify about',
                    sent: 0
                };
            }

            // Use raw SQL query - SIMPLEST and MOST RELIABLE method
            const reservations = await sequelize.query(`
                SELECT 
                    r.reservation_id,
                    r.reservation_date,
                    m.full_name,
                    m.email
                FROM reservations r
                INNER JOIN members m ON r.member_id = m.member_id
                WHERE r.book_id = ? 
                  AND r.status = 'pending'
                  AND m.email IS NOT NULL
                ORDER BY r.reservation_date ASC
            `, {
                replacements: [book_id],
                type: sequelize.QueryTypes.SELECT
            });

            if (reservations.length === 0) {
                return {
                    success: true,
                    message: 'No pending reservations found',
                    sent: 0
                };
            }

            // Send emails to all users
            let sent = 0;
            let failed = 0;
            const errors = [];

            for (const reservation of reservations) {
                try {
                    await this.sendSimpleEmail(
                        reservation.email,
                        reservation.full_name,
                        book.title,
                        book.author
                    );
                    sent++;
                } catch (error) {
                    failed++;
                    errors.push({
                        email: reservation.email,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                message: `Sent ${sent} emails, ${failed} failed`,
                sent,
                failed,
                total: reservations.length,
                errors
            };

        } catch (error) {
            console.error('Notification error:', error);
            throw new Error(`Failed to send notifications: ${error.message}`);
        }
    }

    /**
     * Simple email sender - just send, no complex logic
     */
    async sendSimpleEmail(toEmail, userName, bookTitle, bookAuthor) {
        // Validate environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
        }

        // Initialize transporter if not already done
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: `Book Available: ${bookTitle}`,
            html: `
                <h2>📚 Book Now Available!</h2>
                <p>Hi ${userName},</p>
                <p>Great news! Your reserved book is now available:</p>
                <p><strong>${bookTitle}</strong> by ${bookAuthor}</p>
                <p>Please visit the library to collect it.</p>
                <hr>
                <small>Library Management System</small>
            `
        };

        return await this.transporter.sendMail(mailOptions);
    }
}

export default new ReservationService();
