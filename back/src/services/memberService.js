// services/profileService.js
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import { DataTypes, Op } from 'sequelize';
import memberModel from '../models/Member.js';
import librarianModel from '../models/Librarian.js';

import { Borrowing, Fine, Book, Reservation ,Member,Category,BookCategory} from '../models/index.js';

// Initialize models
//const Member = memberModel(sequelize, DataTypes);
const Librarian = librarianModel(sequelize, DataTypes);

class ProfileService {
  /**
   * Get the correct model and ID field based on user type
   */
  _getModelInfo(userType) {
    if (userType === 'member') {
      return {
        Model: Member,
        idField: 'member_id',
        otherModel: Librarian
      };
    } else if (userType === 'librarian') {
      return {
        Model: Librarian,
        idField: 'librarian_id',
        otherModel: Member
      };
    }
    throw new Error('Invalid user type');
  }

  /**
   * Get user profile (works for both members and librarians)
   */
  async getProfile(userId, userType) {
    const { Model, idField } = this._getModelInfo(userType);
    
    const user = await Model.findOne({
      where: { [idField]: userId },
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Update user profile (works for both members and librarians)
   */
  async updateProfile(userId, userType, updateData) {
    const { Model, idField, otherModel } = this._getModelInfo(userType);
    
    // Define allowed fields based on user type
    const allowedFields = userType === 'member' 
      ? ['full_name', 'email', 'phone'] 
      : ['full_name', 'email'];
    
    const updates = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      throw new Error('No valid fields to update');
    }
    
    // Check if email already exists for another user of the same type
    if (updates.email) {
      const existingSameType = await Model.findOne({
        where: { 
          email: updates.email,
          [idField]: { [Op.ne]: userId }
        }
      });
      
      if (existingSameType) {
        throw new Error('Email already in use');
      }
      
      // Also check in the other user type table
      const existingOtherType = await otherModel.findOne({
        where: { email: updates.email }
      });
      
      if (existingOtherType) {
        throw new Error('Email already in use');
      }
    }
    
    // Update user
    await Model.update(updates, {
      where: { [idField]: userId }
    });
    
    return this.getProfile(userId, userType);
  }

  /**
   * Change password (works for both members and librarians)
   */
  async changePassword(userId, userType, oldPassword, newPassword) {
    const { Model, idField } = this._getModelInfo(userType);
    
    // Get user with password
    const user = await Model.findOne({
      where: { [idField]: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await Model.update(
      { password: hashedPassword },
      { where: { [idField]: userId } }
    );
    
    return { message: 'Password changed successfully' };
  }

  async deleteAccount(memberId, authenticatedUserId) {
    // Members can only delete their own account
    if (memberId !== authenticatedUserId) {
      throw new Error('Access denied: You can only delete your own account');
    }

    const transaction = await sequelize.transaction();

    try {
      // Find the member
      const member = await Member.findByPk(memberId, { transaction });
      
      if (!member) {
        throw new Error('Member not found');
      }

      // Check for active borrowings (books not returned)
      const activeBorrowings = await Borrowing.findAll({
        where: {
          member_id: memberId,
          returned_at: null
        },
        include: [{ model: Book, attributes: ['title'] }],
        transaction
      });

      if (activeBorrowings.length > 0) {
        const bookTitles = activeBorrowings.map(b => b.Book.title).join(', ');
        throw new Error(
          `Cannot delete account: You have ${activeBorrowings.length} unreturned book(s): ${bookTitles}. Please return all books first.`
        );
      }

      // Check for unpaid fines
      const unpaidFines = await Fine.findAll({
        where: {
          member_id: memberId,
          paid: 'no'
        },
        transaction
      });

      if (unpaidFines.length > 0) {
        const totalUnpaid = unpaidFines.reduce(
          (sum, fine) => sum + parseFloat(fine.amount),
          0
        );
        throw new Error(
          `Cannot delete account: You have ${unpaidFines.length} unpaid fine(s) totaling ${totalUnpaid.toFixed(2)}. Please clear all fines first.`
        );
      }

      // Account is eligible for deletion
      // Delete all reservations
      await Reservation.destroy({
        where: { member_id: memberId },
        transaction
      });

      // Delete all fines (only paid ones remain at this point)
      await Fine.destroy({
        where: { member_id: memberId },
        transaction
      });

      // Delete all borrowing records
      await Borrowing.destroy({
        where: { member_id: memberId },
        transaction
      });

      // Delete the member account
      await member.destroy({ transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Account successfully deleted',
        deleted_member_id: memberId,
        member_email: member.email,
        deleted_at: new Date().toISOString()
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async deleteLibrarianAccount(librarianId, authenticatedUserId) {
    // Librarians can only delete their own account
    if (librarianId !== authenticatedUserId) {
      throw new Error('Access denied: You can only delete your own account');
    }

    const transaction = await sequelize.transaction();

    try {
      // Find the librarian
      const librarian = await Librarian.findByPk(librarianId, { transaction });
      
      if (!librarian) {
        throw new Error('Librarian not found');
      }

      // Delete the librarian account
      await librarian.destroy({ transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Account successfully deleted',
        deleted_librarian_id: librarianId,
        librarian_email: librarian.email,
        deleted_at: new Date().toISOString()
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }


   async getAllMembers(filters = {}) {
  const { search, sortBy = 'created_at', order = 'DESC' } = filters;
  const where = {};

  // Search by name, email, or phone
  if (search) {
    where[sequelize.Op.or] = [
      { full_name: { [sequelize.Op.like]: `%${search}%` } },
      { email: { [sequelize.Op.like]: `%${search}%` } },
      { phone: { [sequelize.Op.like]: `%${search}%` } }
    ];
  }

  // Valid sort fields
  const validSortFields = ['full_name', 'email', 'created_at', 'member_id'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';

  const members = await Member.findAll({
    where,
    attributes: ['member_id', 'full_name', 'email', 'phone', 'created_at'],
    order: [[sortField, order.toUpperCase()]],
    include: [
      {
        model: Borrowing,
        attributes: ['borrowing_id', 'borrowed_at', 'due_date', 'returned_at'],
        required: false,
        include: [
          {
            model: Book,
            attributes: ['book_id', 'title', 'author'],
            include: [
              {
                model: Category,
                attributes: ['category_id', 'category_name'],
                through: { attributes: [] } // hide join table fields
              }
            ]
          }
        ]
      },
      {
        model: Fine,
        attributes: ['fine_id', 'amount', 'paid'],
        required: false
      }
    ]
  });

  // Add statistics for each member
  const membersWithStats = members.map(member => {
    const activeBorrowings = member.Borrowings?.filter(b => !b.returned_at).length || 0;
    const totalBorrowings = member.Borrowings?.length || 0;
    const unpaidFines = member.Fines?.filter(f => f.paid === 'no').length || 0;
    const totalUnpaidAmount = member.Fines
      ?.filter(f => f.paid === 'no')
      .reduce((sum, f) => sum + parseFloat(f.amount), 0) || 0;

    return {
      member_id: member.member_id,
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      created_at: member.created_at,
      statistics: {
        active_borrowings: activeBorrowings,
        total_borrowings: totalBorrowings,
        unpaid_fines: unpaidFines,
        total_unpaid_amount: totalUnpaidAmount.toFixed(2)
      },
      borrowings: member.Borrowings // now includes Book and Categories
    };
  });

  return {
    total: membersWithStats.length,
    members: membersWithStats
  };
}

/**
 * Get a single member's details
 * Only accessible by librarians
 */
async getMemberById(memberId) {
  const member = await Member.findByPk(memberId, {
    attributes: ['member_id', 'full_name', 'email', 'phone', 'created_at'],
    include: [
      {
        model: Borrowing,
        attributes: ['borrowing_id', 'borrowed_at', 'due_date', 'returned_at'],
        required: false,
        include: [
          {
            model: Book,
            attributes: ['book_id', 'title', 'author'],
            include: [
              {
                model: Category,
                attributes: ['category_id', 'category_name'],
                through: { attributes: [] }
              }
            ]
          }
        ]
      },
      {
        model: Fine,
        attributes: ['fine_id', 'amount', 'paid', 'generated_at'],
        required: false
      }
    ]
  });

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
}

}

export default new ProfileService();