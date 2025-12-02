// services/profileService.js
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import { DataTypes, Op } from 'sequelize';
import memberModel from '../models/Member.js';
import librarianModel from '../models/Librarian.js';

// Initialize models
const Member = memberModel(sequelize, DataTypes);
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
}

export default new ProfileService();