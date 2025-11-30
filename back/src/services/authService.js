import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import librarianModel from '../models/Librarian.js';
import memberModel from '../models/Member.js';
import sessionModel from '../models/Session.js';
import tokenBlacklistModel from '../models/TokenBlackList.js';
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import qs from "qs";

// Initialize models
const Librarian = librarianModel(sequelize, DataTypes);
const Member = memberModel(sequelize, DataTypes);
const Session = sessionModel(sequelize, DataTypes);
const TokenBlacklist = tokenBlacklistModel(sequelize, DataTypes);

class AuthService {
  constructor() {
    this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    this.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    this.SALT_ROUNDS = 10;
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare password
   */
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, this.JWT_ACCESS_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload, sessionId) {
    return jwt.sign(
      { ...payload, sessionId },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    return jwt.verify(token, this.JWT_ACCESS_SECRET);
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, this.JWT_REFRESH_SECRET);
  }

  /**
   * Generate tokens with session
   */
  async generateTokensWithSession(payload) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const accessToken = this.generateAccessToken(payload,sessionId);
    const refreshToken = this.generateRefreshToken(payload, sessionId);

    await Session.create({
      session_id: sessionId,
      user_id: payload.userId,
      user_type: payload.userType,
      valid: true
    });

    return { accessToken, refreshToken };
  }

  /**
   * SIGNUP - Register new member
   */
  async signup(memberData) {
    const { full_name, email, password, phone } = memberData;

    // Check if email exists in members
    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) {
      throw new Error('Email already registered');
    }

    // Check if email exists in librarians
    const existingLibrarian = await Librarian.findOne({ where: { email } });
    if (existingLibrarian) {
      throw new Error('Email already in use');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create member
    const newMember = await Member.create({
      full_name,
      email,
      password: hashedPassword,
      phone: phone || null
    });

    // Generate tokens
    const tokens = await this.generateTokensWithSession({
      userId: newMember.member_id,
      userType: 'member',
      email: newMember.email,
      fullName: newMember.full_name
    });

    return {
      success: true,
      message: 'Registration successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: newMember.member_id,
        fullName: newMember.full_name,
        email: newMember.email,
        userType: 'member'
      }
    };
  }

  /**
   * LOGIN - For both members and librarians
   */
  async login(email, password) {
    let user = null;
    let userType = null;

    // Check librarians first
    const librarian = await Librarian.findOne({ where: { email } });
    if (librarian) {
      user = librarian;
      userType = 'librarian';
    }

    // Check members if not librarian
    if (!user) {
      const member = await Member.findOne({ where: { email } });
      if (member) {
        user = member;
        userType = 'member';
      }
    }

    // User not found
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const userId = userType === 'librarian' ? user.librarian_id : user.member_id;
    const tokens = await this.generateTokensWithSession({
      userId,
      userType,
      email: user.email,
      fullName: user.full_name
    });

    return {
      success: true,
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: userId,
        fullName: user.full_name,
        email: user.email,
        userType
      }
    };
  }

  /**
   * REFRESH TOKEN
   */
  async refreshAccessToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    // Check if blacklisted
    const blacklisted = await TokenBlacklist.findOne({
      where: { session_id: decoded.sessionId }
    });
    if (blacklisted) {
      throw new Error('Token has been revoked');
    }

    // Check if session valid
    const session = await Session.findOne({
      where: { session_id: decoded.sessionId, valid: true }
    });
    if (!session) {
      throw new Error('Invalid session');
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken({
      userId: decoded.userId,
      userType: decoded.userType,
      email: decoded.email,
      fullName: decoded.fullName
    });

    return {
      success: true,
      accessToken: newAccessToken
    };
  }

  /**
   * LOGOUT
   */
  async logout(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    // Check if already blacklisted
    const existing = await TokenBlacklist.findOne({
      where: { session_id: decoded.sessionId }
    });
    if (existing) {
      return { success: true, message: 'Already logged out' };
    }

    // Invalidate session
    await Session.update(
      { valid: false },
      { where: { session_id: decoded.sessionId } }
    );

    // Add to blacklist
    await TokenBlacklist.create({
      session_id: decoded.sessionId
    });

    return {
      success: true,
      message: 'Logout successful'
    };
  }

  async loginWithGoogle(idToken) {
  // Use this.googleClient instead of googleClient
  const ticket = await this.googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await Member.findOne({ where: { email } });
  let userType = "member";

  if (!user) {
    user = await Member.create({
      full_name: name,
      email,
      password: crypto.randomBytes(16).toString("hex") // random password
    });
  }

  const tokens = await this.generateTokensWithSession({
    userId: user.member_id,
    userType,
    email: user.email,
    fullName: user.full_name
  });

  return {
    success: true,
    message: "Login with Google successful",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.member_id,
      fullName: user.full_name,
      email: user.email,
      userType
    }
  };
}




async loginWithGoogleCode(code) {
  const body = qs.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code"
  });

  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    body,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const idToken = data.id_token;
  return this.loginWithGoogle(idToken);
}


}

export default new AuthService();