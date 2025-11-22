import { Router } from 'express';
import { verifyAssessment, processPayment, getPaymentStatus, refundPayment, getPaymentHistory } from '../controllers/PaymentController';
import authMiddleware from '../middleware/auth';
const router = Router();

// Public routes
router.post('/verify-assessment', verifyAssessment);
router.post('/process-payment', processPayment);
router.get('/payment-status/:transactionId', getPaymentStatus);

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/refund-payment', refundPayment);
router.get('/payment-history/:assessmentNumber', getPaymentHistory);

export default router;