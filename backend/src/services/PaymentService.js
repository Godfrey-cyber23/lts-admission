import { query as _query } from '../config/db';
import crypto from 'crypto';

class PaymentService {
    // Process card payment
    static async processCardPayment(paymentData) {
        const { assessmentNumber, amount, cardNumber, expiryDate, cvv, cardholderName } = paymentData;
        
        // Generate transaction ID
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // In production, integrate with actual payment gateway (Stripe, PayPal, etc.)
        // For now, simulate payment processing
        const payment = {
            transactionId,
            assessmentNumber,
            method: 'card',
            amount,
            status: 'completed',
            cardLast4: cardNumber.slice(-4),
            cardholderName,
            timestamp: new Date().toISOString(),
            paymentGateway: 'mock-gateway' // Replace with actual gateway
        };
        
        // Store payment record
        await this.storePaymentRecord(payment);
        
        return payment;
    }
    
    // Process mobile money payment
    static async processMobilePayment(paymentData) {
        const { assessmentNumber, amount, mobileNumber } = paymentData;
        
        // Generate transaction ID
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // In production, integrate with actual mobile money provider (MTN, Airtel, etc.)
        const payment = {
            transactionId,
            assessmentNumber,
            method: 'mobile',
            amount,
            status: 'completed',
            mobileNumber,
            timestamp: new Date().toISOString(),
            paymentGateway: 'mock-mobile-gateway' // Replace with actual provider
        };
        
        // Store payment record
        await this.storePaymentRecord(payment);
        
        return payment;
    }
    
    // Store payment record in database
    static async storePaymentRecord(paymentData) {
        const query = `
            INSERT INTO payments (
                transaction_id, assessment_number, method, amount, status,
                card_last4, cardholder_name, mobile_number, timestamp,
                payment_gateway, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING id
        `;
        
        const values = [
            paymentData.transactionId,
            paymentData.assessmentNumber,
            paymentData.method,
            paymentData.amount,
            paymentData.status,
            paymentData.cardLast4 || null,
            paymentData.cardholderName || null,
            paymentData.mobileNumber || null,
            paymentData.timestamp,
            paymentData.paymentGateway
        ];
        
        const result = await _query(query, values);
        return result.rows[0];
    }
    
    // Get payment by transaction ID
    static async getPaymentByTransactionId(transactionId) {
        const query = 'SELECT * FROM payments WHERE transaction_id = $1';
        const result = await _query(query, [transactionId]);
        return result.rows[0] || null;
    }
    
    // Refund payment
    static async refundPayment(transactionId, reason) {
        const payment = await this.getPaymentByTransactionId(transactionId);
        
        if (!payment) {
            throw new Error('Payment not found');
        }
        
        if (payment.status !== 'completed') {
            throw new Error('Payment cannot be refunded');
        }
        
        // Update payment status to refunded
        const updateQuery = `
            UPDATE payments 
            SET status = 'refunded', refund_reason = $1, refunded_at = NOW()
            WHERE transaction_id = $2
            RETURNING *
        `;
        
        const result = await _query(updateQuery, [reason, transactionId]);
        return result.rows[0];
    }
    
    // Get payment history for assessment
    static async getPaymentHistory(assessmentNumber) {
        const query = `
            SELECT * FROM payments 
            WHERE assessment_number = $1 
            ORDER BY created_at DESC
        `;
        const result = await _query(query, [assessmentNumber]);
        return result.rows;
    }
}

export default PaymentService;