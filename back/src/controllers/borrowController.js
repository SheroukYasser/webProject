import borrowingService from '../services/borrowService.js';

class BorrowingController {
  async borrowBook(req, res) {
    try {
      // Extract user info from auth middleware
      const { userId, userType } = req.user;
      
      const result = await borrowingService.borrowBook(req.body, userId);
      res.status(201).json({
        success: true,
        message: 'Book borrowed successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async returnBook(req, res) {
    try {
      const { borrowing_id } = req.params;
      const result = await borrowingService.returnBook(borrowing_id);
      
      res.json({
        success: true,
        message: 'Book returned successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllBorrowings(req, res) {
    try {
      const { userId, userType } = req.user;
      const borrowings = await borrowingService.getAllBorrowings(
        req.query, 
        userType, 
        userId
      );
      res.json({
        success: true,
        data: borrowings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getBorrowingById(req, res) {
    try {
      const { borrowing_id } = req.params;
      const { userId, userType } = req.user;
      
      const borrowing = await borrowingService.getBorrowingById(
        borrowing_id, 
        userType, 
        userId
      );
      res.json({
        success: true,
        data: borrowing
      });
    } catch (error) {
      const statusCode = error.message.includes('Access denied') ? 403 : 404;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateOverdueStatus(req, res) {
    try {
      const count = await borrowingService.updateOverdueStatus();
      res.json({
        success: true,
        message: `${count} borrowing(s) updated`,
        data: { updated_count: count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMemberHistory(req, res) {
    try {
      const { member_id } = req.params;
      const { userId, userType } = req.user;
      
      const history = await borrowingService.getMemberBorrowingHistory(
        parseInt(member_id), 
        userType, 
        userId
      );
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      const statusCode = error.message.includes('Access denied') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new BorrowingController();