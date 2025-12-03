import fineService from '../services/fineService.js';

class FineController {
  async getAllFines(req, res) {
    try {
      const fines = await fineService.getAllFines(req.query);
      res.json({
        success: true,
        data: fines
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFineById(req, res) {
    try {
      const { fine_id } = req.params;
      const { userId, userType } = req.user;
      
      const fine = await fineService.getFineById(fine_id, userType, userId);
      res.json({
        success: true,
        data: fine
      });
    } catch (error) {
      const statusCode = error.message.includes('Access denied') ? 403 : 404;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async payFine(req, res) {
    try {
      const { fine_id } = req.params;
      const fine = await fineService.payFine(fine_id);
      res.json({
        success: true,
        message: 'Fine paid successfully',
        data: fine
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMemberUnpaidFines(req, res) {
    try {
      const { member_id } = req.params;
      const { userId } = req.user;
      
      const result = await fineService.getMemberUnpaidFines(
        parseInt(member_id), 
        userId
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('Access denied') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMemberFineHistory(req, res) {
    try {
      const { member_id } = req.params;
      const { userId } = req.user;
      
      const result = await fineService.getMemberFineHistory(
        parseInt(member_id), 
        userId
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('Access denied') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFineReport(req, res) {
    try {
      const report = await fineService.generateFineReport();
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new FineController();
