// middlewares/auth.js
import AuthService from "../services/authService.js";
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import sessionModel from '../models/Session.js';
import tokenBlacklistModel from '../models/TokenBlackList.js';

// Initialize models
const Session = sessionModel(sequelize, DataTypes);
const TokenBlacklist = tokenBlacklistModel(sequelize, DataTypes);

/**
 * Basic Authentication - Fast (No DB queries)
 * Use for: Regular operations, browsing, searching
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded; // attach decoded user info to req

    return next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Enhanced Authentication with Session Validation - Secure (DB queries)
 * Use for: Profile operations, sensitive data, account modifications
 */
export const authenticateWithSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify JWT token
    const decoded = AuthService.verifyAccessToken(token);
    
    // Check if session exists and is valid
    if (decoded.sessionId) {
      const session = await Session.findOne({
        where: { 
          session_id: decoded.sessionId,
          valid: true
        }
      });
      
      if (!session) {
        return res.status(401).json({ 
          success: false, 
          message: "Session expired or invalid" 
        });
      }
      
      // Check if token is blacklisted
      const blacklisted = await TokenBlacklist.findOne({
        where: { session_id: decoded.sessionId }
      });
      
      if (blacklisted) {
        return res.status(401).json({ 
          success: false, 
          message: "Token has been revoked" 
        });
      }
    }
    
    // Attach user info to request
    req.user = decoded;
    
    return next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Access token expired" 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Authentication error" 
    });
  }
};



/**
 * Check if user is a Librarian
 */
export const isLibrarian = (req, res, next) => {
  if (!req.user || req.user.userType !== "librarian") {
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden: Librarian access only" 
    });
  }
  next();
};

/**
 * Check if user is a Member
 */
export const isMember = (req, res, next) => {
  if (!req.user || req.user.userType !== "member") {
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden: Member access only" 
    });
  }
  next();
};

/**
 * Flexible authorization - allow multiple user types
 */
export const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    next();
  };
};