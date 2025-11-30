// controllers/profileController.js
import ProfileService from '../services/memberService.js';

class ProfileController {
  /**
   * Get user profile (works for both members and librarians)
   * GET /api/profile
   */
  async getProfile(req, res) {
    try {
      const { userId, userType } = req.user;
      
      const profile = await ProfileService.getProfile(userId, userType);
      
      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update user profile (works for both members and librarians)
   * PUT /api/profile
   */
  async updateProfile(req, res) {
    try {
      const { userId, userType } = req.user;
      const updateData = req.body;
      
      // Validation
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No data provided for update'
        });
      }
      
      // Validate email format if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
        }
      }
      
      // Validate phone format if provided (only for members)
      if (updateData.phone) {
        if (userType !== 'member') {
          return res.status(400).json({
            success: false,
            message: 'Phone number can only be updated by members'
          });
        }
        
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(updateData.phone)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format. Must be Egyptian format (01XXXXXXXXX)'
          });
        }
      }
      
      const updatedProfile = await ProfileService.updateProfile(
        userId,
        userType,
        updateData
      );
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Change password (works for both members and librarians)
   * PUT /api/profile/change-password
   */
  async changePassword(req, res) {
    try {
      const { userId, userType } = req.user;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      
      // Validation
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'All password fields are required'
        });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New passwords do not match'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      
      if (oldPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password must be different from old password'
        });
      }
      
      const result = await ProfileService.changePassword(
        userId,
        userType,
        oldPassword,
        newPassword
      );
      
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new ProfileController();