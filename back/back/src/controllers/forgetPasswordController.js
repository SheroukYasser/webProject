

import PasswordService from '../services/fogetPasswordService.js';

class PasswordController {

  // Step 1: Request code
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await PasswordService.requestPasswordReset(email);

      // Use domain as '127.0.0.1' to match frontend
res.cookie('pendingEmail', email, {
  httpOnly: true,
  secure: false,          // local dev over HTTP
  sameSite: 'lax',        // allow sending on POST from same origin
  domain: 'localhost',    // must match frontend host
  path: '/',
  maxAge: 10 * 60 * 1000
});

      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Step 2: Verify code
  async verifyCode(req, res) {
    try {
      const { code } = req.body;
      const email = req.cookies.pendingEmail;
      if (!email) throw new Error('No pending email');

      PasswordService.verifyCode(email, code);

      // Mark code as verified in cookie
      res.cookie('codeVerified', true, {
        httpOnly: true,
        secure:false,
        sameSite: 'lax',
        domain: 'localhost',  
        path: '/',
        maxAge: 10 * 60 * 1000
      });

      res.status(200).json({ success: true, message: 'Code verified. You can reset password now.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Step 3: Reset password (no need to re-enter code)
  async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const email = req.cookies.pendingEmail;
      const codeVerified = req.cookies.codeVerified;

      if (!email) throw new Error('No pending email verification');
      if (!codeVerified) throw new Error('Code not verified');

      const result = await PasswordService.resetPassword(email, newPassword);

      // Clear cookies
      res.clearCookie('pendingEmail');
      res.clearCookie('codeVerified');

      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default new PasswordController();

