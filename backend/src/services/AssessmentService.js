import { query as _query } from '../config/db';

class AssessmentService {
    // Get assessment by number
    static async getAssessmentByNumber(assessmentNumber) {
        const query = 'SELECT * FROM assessments WHERE assessment_number = $1';
        const result = await _query(query, [assessmentNumber]);
        return result.rows[0] || null;
    }
    
    // Update payment status
    static async updatePaymentStatus(assessmentNumber, status, transactionId) {
        const query = `
            UPDATE assessments 
            SET payment_status = $1, transaction_id = $2, updated_at = NOW()
            WHERE assessment_number = $3
            RETURNING *
        `;
        
        const result = await _query(query, [status, transactionId, assessmentNumber]);
        return result.rows[0];
    }
    
    // Create new assessment record
    static async createAssessment(assessmentData) {
        const {
            studentName,
            studentAge,
            parentName,
            parentContact,
            assessmentDate,
            assessmentScore,
            status = 'completed'
        } = assessmentData;
        
        const assessmentNumber = 'AS' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const query = `
            INSERT INTO assessments (
                assessment_number, student_name, student_age, parent_name,
                parent_contact, assessment_date, assessment_score, status,
                payment_status, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
            RETURNING *
        `;
        
        const values = [
            assessmentNumber,
            studentName,
            studentAge,
            parentName,
            parentContact,
            assessmentDate,
            assessmentScore,
            status
        ];
        
        const result = await _query(query, values);
        return result.rows[0];
    }
    
    // Get all assessments
    static async getAllAssessments(limit = 50, offset = 0) {
        const query = `
            SELECT * FROM assessments 
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `;
        const result = await _query(query, [limit, offset]);
        return result.rows;
    }
    
    // Get assessment statistics
    static async getAssessmentStats() {
        const query = `
            SELECT 
                COUNT(*) as total_assessments,
                COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_assessments,
                COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_assessments,
                SUM(CASE WHEN payment_status = 'paid' THEN 50.00 ELSE 0 END) as total_revenue
            FROM assessments
        `;
        const result = await _query(query);
        return result.rows[0];
    }
}

export default AssessmentService;