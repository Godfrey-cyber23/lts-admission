import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import financeController from '../controllers/financeController.js';

const router = express.Router();

router.use(protect);

router.get('/payments', authorize('admin', 'staff'), financeController.getAllPayments);
router.get('/payments/:id', authorize('admin', 'staff'), financeController.getPayment);
router.post('/payments', authorize('admin', 'staff'), financeController.createPayment);
router.put('/payments/:id', authorize('admin'), financeController.updatePayment);
router.get('/stats', authorize('admin'), financeController.getFinancialStats);
router.get('/reports', authorize('admin'), financeController.getPaymentReports);

export default router;