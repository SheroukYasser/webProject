import { Fine, Member, Borrowing, Book } from '../models/index.js';
import sequelize from '../config/db.js';

class FineService {
  async getAllFines(filters = {}) {
    const { paid, member_id } = filters;
    const where = {};

    if (paid) where.paid = paid;
    if (member_id) where.member_id = member_id;

    const fines = await Fine.findAll({
      where,
      include: [
        { model: Member, attributes: ['name', 'email'] },
        { 
          model: Borrowing, 
          include: [{ model: Book, attributes: ['title'] }] 
        }
      ],
      order: [['generated_at', 'DESC']]
    });

    return fines;
  }

  async getFineById(fineId, userType, userId) {
    const fine = await Fine.findByPk(fineId, {
      include: [
        Member,
        {
          model: Borrowing,
          include: [Book]
        }
      ]
    });

    if (!fine) {
      throw new Error('Fine not found');
    }

    // Members can only view their own fines
    if (userType === 'member' && fine.member_id !== userId) {
      throw new Error('Access denied: You can only view your own fines');
    }

    return fine;
  }

  async payFine(fineId) {
    const fine = await Fine.findByPk(fineId);

    if (!fine) {
      throw new Error('Fine not found');
    }

    if (fine.paid === 'yes') {
      throw new Error('Fine already paid');
    }

    await fine.update({ paid: 'yes' });

    return fine;
  }

  async getMemberUnpaidFines(memberId, authenticatedUserId) {
    // Members can only view their own fines
    if (memberId !== authenticatedUserId) {
      throw new Error('Access denied: You can only view your own fines');
    }

    const fines = await Fine.findAll({
      where: { member_id: memberId, paid: 'no' },
      include: [{ 
        model: Borrowing, 
        include: [{ model: Book, attributes: ['title'] }] 
      }]
    });

    const totalAmount = fines.reduce(
      (sum, fine) => sum + parseFloat(fine.amount), 
      0
    );

    return {
      fines,
      total_amount: totalAmount.toFixed(2),
      count: fines.length
    };
  }

  async getMemberFineHistory(memberId, authenticatedUserId) {
    // Members can only view their own fine history
    if (memberId !== authenticatedUserId) {
      throw new Error('Access denied: You can only view your own fine history');
    }

    const fines = await Fine.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: Borrowing,
          include: [{ model: Book, attributes: ['title'] }]
        }
      ],
      order: [['generated_at', 'DESC']]
    });

    const totalPaid = fines
      .filter(f => f.paid === 'yes')
      .reduce((sum, f) => sum + parseFloat(f.amount), 0);

    const totalUnpaid = fines
      .filter(f => f.paid === 'no')
      .reduce((sum, f) => sum + parseFloat(f.amount), 0);

    return {
      fines,
      summary: {
        total_paid: totalPaid.toFixed(2),
        total_unpaid: totalUnpaid.toFixed(2),
        total_fines: fines.length
      }
    };
  }

  async generateFineReport() {
    const report = await Fine.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('fine_id')), 'total_fines'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
        'paid'
      ],
      group: ['paid']
    });

    return report;
  }
}

export default new FineService();