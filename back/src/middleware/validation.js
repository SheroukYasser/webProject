import { body } from "express-validator";

// Your existing validations
export const signupValidation = [
  body("full_name").isString().notEmpty().trim().escape().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("phone").optional().isMobilePhone().withMessage("Invalid phone number")
];

export const loginValidation = [
  body("email").isEmail().withMessage('Valid email is required').normalizeEmail(),
  body("password").notEmpty().withMessage('Password is required').trim(),
];

// NEW: Forgot password validations
export const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
];

export const verifyCodeValidation = [
  
  body("code")
    .notEmpty()
    .withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be 6 digits")
    .isNumeric()
    .withMessage("Code must contain only numbers")
];

export const resetPasswordValidation = [
 
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim()
];