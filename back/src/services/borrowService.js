import { Borrowing, Book, Member, Fine } from '../models/index.js';
import { Op } from 'sequelize';

class BorrowingService {
  async borrowBook(memberData, authenticatedUserId) {
    const { member_id, book_id } = memberData;
    const borrowDays = 14;

    // Ensure member can only borrow for themselves
    if (authenticatedUserId !== member_id) {
      throw new Error('You can only borrow books for yourself');
    }
    const member = await Member.findByPk(member_id);
    if (!member) {
        throw new Error('Member not found'); 
    }

    // Check book availability
    const book = await Book.findByPk(book_id);
    if (!book || book.available_copies <= 0) {
      throw new Error('Book not available');
    }

    // Check for unpaid fines
    const unpaidFines = await Fine.count({
      where: { member_id, paid: 'no' }
    });
    if (unpaidFines > 0) {
      throw new Error('Please clear outstanding fines first');
    }

    // Calculate dates
    const borrowed_at = new Date();
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + borrowDays);

    // Create borrowing
    const borrowing = await Borrowing.create({
      member_id,
      book_id,
      borrowed_at: borrowed_at.toISOString().split('T')[0],
      due_date: due_date.toISOString().split('T')[0]
    });

    // Update book availability
    await book.update({ 
      available_copies: book.available_copies - 1 
    });

    return {
      borrowing_id: borrowing.borrowing_id,
      book_title: book.title,
      borrowed_at: borrowing.borrowed_at,
      due_date: borrowing.due_date
    };
  }

  async returnBook(borrowingId) {
    const borrowing = await Borrowing.findByPk(borrowingId, {
      include: [Book, Member]
    });

    if (!borrowing) {
      throw new Error('Borrowing record not found');
    }

    if (borrowing.returned_at) {
      throw new Error('Book already returned');
    }

    const returned_at = new Date();
    const due_date = new Date(borrowing.due_date);
    
    let fineAmount = 0;
    let fineRecord = null;

    // Calculate fine if overdue
    if (returned_at > due_date) {
      const daysLate = Math.ceil(
        (returned_at - due_date) / (1000 * 60 * 60 * 24)
      );
      fineAmount = daysLate * 5; // $5 per day

      // Create fine record
      fineRecord = await Fine.create({
        borrowing_id: borrowing.borrowing_id,
        member_id: borrowing.member_id,
        amount: fineAmount,
        paid: 'no'
      });

      await borrowing.update({
        returned_at: returned_at.toISOString().split('T')[0],
        fine_amount: fineAmount
      });
    } else {
      await borrowing.update({
        returned_at: returned_at.toISOString().split('T')[0]
      });
    }

    // Update book availability
    await borrowing.Book.update({
      available_copies: borrowing.Book.available_copies + 1
    });

    return {
      borrowing,
      fine: fineRecord ? {
        amount: fineAmount,
        fine_id: fineRecord.fine_id
      } : null
    };
  }

  async getAllBorrowings(filters = {}, userType, userId) {
    const { status, member_id } = filters;
    const where = {};


    if (member_id) where.member_id = member_id;

    // Members can only see their own borrowings
    if (userType === 'member') {
      where.member_id = userId;
    }

    const borrowings = await Borrowing.findAll({
      where,
      include: [
        { model: Book, attributes: ['title', 'author', 'isbn'] },
        { model: Member, attributes: ['name', 'email'] }
      ],
      order: [['borrowed_at', 'DESC']]
    });

    return borrowings;
  }

  async getBorrowingById(borrowingId, userType, userId) {
    const borrowing = await Borrowing.findByPk(borrowingId, {
      include: [Book, Member, Fine]
    });

    if (!borrowing) {
      throw new Error('Borrowing not found');
    }

    // Members can only view their own borrowings
    if (userType === 'member' && borrowing.member_id !== userId) {
      throw new Error('Access denied: You can only view your own borrowings');
    }

    return borrowing;
  }

  async updateOverdueStatus() {
    const today = new Date().toISOString().split('T')[0];

    const [updatedCount] = await Borrowing.update(
      { fine_amount: 0 },
      {
        where: {
          due_date: { [Op.lt]: today },
          returned_at: null
        }
      }
    );

    return updatedCount;
  }

  async getMemberBorrowingHistory(memberId, userType, authenticatedUserId) {
    // Members can only view their own history
    if (userType === 'member' && memberId !== authenticatedUserId) {
      throw new Error('Access denied: You can only view your own history');
    }

    const borrowings = await Borrowing.findAll({
      where: { member_id: memberId },
      include: [
        { model: Book, attributes: ['title', 'author'] },
        { model: Fine }
      ],
      order: [['borrowed_at', 'DESC']]
    });

    return borrowings;
  }
}

export default new BorrowingService();