// src/services/PaymentService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class PaymentService {
    // Verify assessment number
    static async verifyAssessment(assessmentNumber) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/verify-assessment`, {
                assessmentNumber
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to verify assessment number' };
        }
    }

    // Process payment
    static async processPayment(paymentData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/process-payment`, paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Payment processing failed' };
        }
    }

    // Get payment status
    static async getPaymentStatus(transactionId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/payment-status/${transactionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get payment status' };
        }
    }

    // Refund payment
    static async refundPayment(transactionId, reason) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/refund-payment`, {
                transactionId,
                reason
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Refund failed' };
        }
    }
}

export default PaymentService;