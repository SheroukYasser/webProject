import express from "express";
import AuthController from "../controllers/authController.js";
import { signupValidation, loginValidation } from "../middleware/validation.js";
import AuthService from "../services/authService.js";
import passwordController from '../controllers/forgetPasswordController.js';
import { 
  forgotPasswordValidation,
  verifyCodeValidation,
  resetPasswordValidation
} from '../middleware/validation.js';



const router = express.Router();


router.post("/signup", signupValidation, (req, res) => AuthController.signup(req, res));

router.post("/login", loginValidation, (req, res) => AuthController.login(req, res));


router.post("/refresh-token", (req, res) => AuthController.refreshToken(req, res));


router.post("/logout", (req, res) => AuthController.logout(req, res));


router.post("/google", AuthController.googleLogin);



router.post('/forgot', forgotPasswordValidation,  passwordController.forgotPassword);
router.post('/verify-code', verifyCodeValidation, passwordController.verifyCode);
router.post('/reset', resetPasswordValidation, passwordController.resetPassword);






export default router;
