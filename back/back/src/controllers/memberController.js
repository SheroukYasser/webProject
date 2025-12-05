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
  async deleteAccount(req, res) {
    try {
      const authenticatedUserId = req.user.userId; // from JWT token

      const result = await ProfileService.deleteAccount(
        authenticatedUserId,
        authenticatedUserId
      );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      // Handle specific error messages
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Cannot delete account')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      // Generic error
      console.error('Delete account error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete account',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }


  async deleteLibrarianAccountController(req, res) {
    try {
      const authenticatedUserId = req.user.userId; // from JWT token

      const result = await LibrarianService.deleteLibrarianAccount(
        authenticatedUserId,
        authenticatedUserId
      );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      // Handle specific error messages
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      // Generic error
      console.error('Delete librarian account error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete account',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }





  /**
   * Get all members with borrowings and book details
   * GET /api/members
   * Accessible only by librarians
   */
  async getAllMembers(req, res) {
    try {
      const { search, sortBy, order } = req.query;

      // Call service with filters
      const result = await ProfileService.getAllMembers({ search, sortBy, order });

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Get all members error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve members',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get single member by ID with borrowings and book details
   * GET /api/members/:id
   * Accessible only by librarians
   */
  async getMemberById(req, res) {
    try {
      const memberId = parseInt(req.params.id);

      if (isNaN(memberId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid member ID'
        });
      }

      // Call service
      const member = await ProfileService.getMemberById(memberId);

      return res.status(200).json({
        success: true,
        data: member
      });

    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      console.error('Get member error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve member',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }


}

export default new ProfileController();