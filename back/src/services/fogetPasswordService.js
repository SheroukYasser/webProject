

import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import librarianModel from '../models/Librarian.js';
import memberModel from '../models/Member.js';
import sessionModel from '../models/Session.js';
import nodemailer from 'nodemailer';

const Librarian = librarianModel(sequelize, DataTypes);
const Member = memberModel(sequelize, DataTypes);
const Session = sessionModel(sequelize, DataTypes);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Stores both code and expiration
const tempCodes = new Map();

class PasswordService {

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCode(email, fullName) {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    tempCodes.set(email, { code, expiresAt });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: `<p>Hello ${fullName},</p><p>Your verification code is <strong>${code}</strong> (expires in 10 minutes).</p>`
    });

    // Return code only for testing (in production, remove)
    return code;
  }

  async requestPasswordReset(email) {
    const user = await Librarian.findOne({ where: { email } }) || await Member.findOne({ where: { email } });
    if (!user) throw new Error('Email not found');

    await this.sendCode(email, user.full_name);

    return { success: true, message: 'Verification code sent', email };
  }

  verifyCode(email, code) {
    const entry = tempCodes.get(email);
    if (!entry) throw new Error('No verification code found');
    if (entry.expiresAt < new Date()) { tempCodes.delete(email); throw new Error('Code expired'); }
    if (entry.code !== code) throw new Error('Invalid code');

    return { success: true, message: 'Code verified', email };
  }

  async resetPassword(email, newPassword) {
    const entry = tempCodes.get(email);
    if (!entry) throw new Error('No pending reset request');
    if (entry.expiresAt < new Date()) { tempCodes.delete(email); throw new Error('Code expired'); }

    // Find user
    let user = await Member.findOne({ where: { email } }) || await Librarian.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const userType = user instanceof Member ? 'member' : 'librarian';
    const userId = user instanceof Member ? user.member_id : user.librarian_id;

await Session.update(
  { valid: false },
  { where: { user_id: userId, user_type: userType, valid: true } }
);


    // Clear temp code
    tempCodes.delete(email);

    return { success: true, message: 'Password reset successfully' };
  }
}

export default new PasswordService();
