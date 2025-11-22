import PaymentService from '../services/PaymentService';
import AssessmentService from '../services/AssessmentService';

class PaymentController {
    // Verify assessment number
    static async verifyAssessment(req, res) {
        try {
            const { assessmentNumber } = req.body;
            
            if (!assessmentNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Assessment number is required'
                });
            }
            
            // Check if assessment exists and is valid
            const assessment = await AssessmentService.getAssessmentByNumber(assessmentNumber);
            
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment number not found'
                });
            }
            
            if (assessment.status !== 'completed') {
                return res.status(400).json({
                    success: false,
                    message: 'Assessment not completed'
                });
            }
            
            if (assessment.payment_status === 'paid') {
                return res.status(400).json({
                    success: false,
                    message: 'Payment already completed for this assessment'
                });
            }
            
            res.status(200).json({
                success: true,
                data: {
                    assessmentNumber: assessment.assessment_number,
                    studentName: assessment.student_name,
                    assessmentDate: assessment.assessment_date
                }
            });
        } catch (error) {
            console.error('Error verifying assessment:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    
    // Process payment
    static async processPayment(req, res) {
        try {
            const { assessmentNumber, method, amount, ...paymentDetails } = req.body;
            
            // Validate required fields
            if (!assessmentNumber || !method || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required payment information'
                });
            }
            
            // Verify assessment exists
            const assessment = await AssessmentService.getAssessmentByNumber(assessmentNumber);
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found'
                });
            }
            
            // Process payment based on method
            let paymentResult;
            switch (method) {
                case 'card':
                    paymentResult = await PaymentService.processCardPayment({
                        assessmentNumber,
                        amount,
                        cardNumber: paymentDetails.cardNumber,
                        expiryDate: paymentDetails.expiryDate,
                        cvv: paymentDetails.cvv,
                        cardholderName: paymentDetails.cardholderName
                    });
                    break;
                    
                case 'mobile':
                    paymentResult = await PaymentService.processMobilePayment({
                        assessmentNumber,
                        amount,
                        mobileNumber: paymentDetails.mobileNumber
                    });
                    break;
                    
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid payment method'
                    });
            }
            
            // Update assessment payment status
            await AssessmentService.updatePaymentStatus(assessmentNumber, 'paid', paymentResult.transactionId);
            
            res.status(200).json({
                success: true,
                data: paymentResult
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Payment processing failed'
            });
        }
    }
    
    // Get payment status
    static async getPaymentStatus(req, res) {
        try {
            const { transactionId } = req.params;
            
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Transaction ID is required'
                });
            }
            
            const payment = await PaymentService.getPaymentByTransactionId(transactionId);
            
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: payment
            });
        } catch (error) {
            console.error('Error getting payment status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    
    // Refund payment
    static async refundPayment(req, res) {
        try {
            const { transactionId, reason } = req.body;
            
            if (!transactionId || !reason) {
                return res.status(400).json({
                    success: false,
                    message: 'Transaction ID and reason are required'
                });
            }
            
            const refundResult = await PaymentService.refundPayment(transactionId, reason);
            
            res.status(200).json({
                success: true,
                data: refundResult
            });
        } catch (error) {
            console.error('Error processing refund:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Refund failed'
            });
        }
    }
    
    // Get payment history
    static async getPaymentHistory(req, res) {
        try {
            const { assessmentNumber } = req.params;
            
            if (!assessmentNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Assessment number is required'
                });
            }
            
            const payments = await PaymentService.getPaymentHistory(assessmentNumber);
            
            res.status(200).json({
                success: true,
                data: payments
            });
        } catch (error) {
            console.error('Error getting payment history:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default PaymentController;