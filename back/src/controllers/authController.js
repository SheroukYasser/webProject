import AuthService from "../services/authService.js";
import { validationResult } from "express-validator";

class AuthController {
  /**
   * @route POST /auth/signup
   */
  async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const result = await AuthService.signup(req.body);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * @route POST /auth/login
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return res.status(200).json(result);

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * @route POST /auth/refresh-token
   */
  async refreshToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    const refreshToken = authHeader.split(" ")[1];
    const result = await AuthService.refreshAccessToken(refreshToken);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}


  /**
   * @route POST /auth/logout
   */
  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    const refreshToken = authHeader.split(" ")[1];

      const result = await AuthService.logout(refreshToken);
      return res.status(200).json(result);

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async googleLogin(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "idToken is required" });
    }

    const result = await AuthService.loginWithGoogle(idToken);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
 async googleCallback(req, res) {
    try {
      const code = req.query.code;
      if (!code) {
        return res.status(400).json({ success: false, message: "No code provided" });
      }

      // Exchange code for tokens using AuthService
      const result = await AuthService.loginWithGoogleCode(code);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

}

export default new AuthController();
