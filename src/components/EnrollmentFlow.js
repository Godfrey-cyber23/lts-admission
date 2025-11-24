// src/components/EnrollmentFlow.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../styles/themes';
import { usePayment } from '../context/PaymentProvider';
import AdmissionForm from './AdmissionForm';

const EnrollmentFlow = () => {
    const theme = useTheme();
    const { verifyAssessment, processPayment, isLoading, error, clearError } = usePayment();
    const [currentStep, setCurrentStep] = useState('assessment');
    const [assessmentNumber, setAssessmentNumber] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [paymentDetails, setPaymentDetails] = useState({
        method: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        mobileNumber: '',
        amount: '50.00'
    });
    
    // Validate assessment number
    const validateAssessmentNumber = () => {
        if (!assessmentNumber.trim()) {
            setErrors({ assessmentNumber: 'Assessment number is required' });
            return false;
        }
        
        if (assessmentNumber.length < 5) {
            setErrors({ assessmentNumber: 'Invalid assessment number' });
            return false;
        }
        
        setErrors({});
        return true;
    };
    
    // Handle assessment number submission
    const handleAssessmentSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateAssessmentNumber()) return;
        
        try {
            await verifyAssessment(assessmentNumber);
            setCurrentStep('payment');
        } catch (error) {
            setErrors({ assessmentNumber: error.message || 'Invalid assessment number' });
        }
    };
    
    // Handle payment form changes
    const handlePaymentChange = (field, value) => {
        setPaymentDetails(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    
    // Format card number input
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };
    
    // Format expiry date input
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        
        return v;
    };
    
    // Validate payment form
    const validatePaymentForm = () => {
        const newErrors = {};
        
        if (paymentDetails.method === 'card') {
            if (!paymentDetails.cardNumber.trim()) {
                newErrors.cardNumber = 'Card number is required';
            } else if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
                newErrors.cardNumber = 'Invalid card number';
            }
            
            if (!paymentDetails.expiryDate.trim()) {
                newErrors.expiryDate = 'Expiry date is required';
            }
            
            if (!paymentDetails.cvv.trim()) {
                newErrors.cvv = 'CVV is required';
            } else if (paymentDetails.cvv.length < 3) {
                newErrors.cvv = 'Invalid CVV';
            }
            
            if (!paymentDetails.cardholderName.trim()) {
                newErrors.cardholderName = 'Cardholder name is required';
            }
        } else {
            if (!paymentDetails.mobileNumber.trim()) {
                newErrors.mobileNumber = 'Mobile number is required';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle payment submission
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePaymentForm()) return;
        
        setPaymentStatus('pending');
        
        try {
            const result = await processPayment({
                assessmentNumber,
                ...paymentDetails
            });
            
            setPaymentStatus('success');
            setTimeout(() => {
                setCurrentStep('enrollment');
            }, 1500);
        } catch (error) {
            setPaymentStatus('failed');
            setErrors({ payment: error.message || 'Payment failed. Please try again.' });
        }
    };
    
    // Render assessment number input form
    const renderAssessmentForm = () => (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.colors.primaryLight,
            padding: theme.sizes.spacing.xl,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                maxWidth: theme.sizes.container.form,
                width: '100%',
                backgroundColor: theme.colors.white,
                borderRadius: theme.sizes.borderRadius.medium,
                boxShadow: theme.shadows.lg,
                overflow: 'hidden'
            }}>
                <div style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    padding: theme.sizes.spacing.lg,
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontFamily: theme.fonts.heading,
                        margin: 0,
                        color: theme.colors.white,
                        fontSize: '1.8rem'
                    }}>
                        Literacy Tree School Enrollment
                    </h1>
                    <p style={{
                        margin: `${theme.sizes.spacing.sm} 0 0`,
                        opacity: 0.9
                    }}>
                        Enter your assessment number to begin
                    </p>
                </div>
                
                <form onSubmit={handleAssessmentSubmit} style={{
                    padding: theme.sizes.spacing.xl
                }}>
                    <div style={{ marginBottom: theme.sizes.spacing.lg }}>
                        <label style={{
                            display: 'block',
                            marginBottom: theme.sizes.spacing.sm,
                            fontWeight: 600,
                            color: theme.colors.text
                        }}>
                            Assessment Number
                        </label>
                        <input
                            type="text"
                            value={assessmentNumber}
                            onChange={(e) => setAssessmentNumber(e.target.value)}
                            placeholder="Enter your assessment number"
                            style={{
                                width: '100%',
                                padding: theme.sizes.spacing.sm,
                                border: `1px solid ${errors.assessmentNumber ? theme.colors.error : theme.colors.border}`,
                                borderRadius: theme.sizes.borderRadius.small,
                                fontFamily: theme.fonts.main
                            }}
                        />
                        {errors.assessmentNumber && (
                            <div style={{
                                color: theme.colors.error,
                                fontSize: '0.875rem',
                                marginTop: theme.sizes.spacing.sm
                            }}>
                                {errors.assessmentNumber}
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: isLoading ? theme.colors.gray[300] : theme.colors.primary,
                            color: theme.colors.white,
                            border: 'none',
                            padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                            borderRadius: theme.sizes.borderRadius.small,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontFamily: theme.fonts.main,
                            fontWeight: 600,
                            width: '100%',
                            fontSize: '1rem'
                        }}
                    >
                        {isLoading ? 'Verifying...' : 'Continue to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
    
    // Render payment form
    const renderPaymentForm = () => (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.colors.primaryLight,
            padding: theme.sizes.spacing.xl,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                maxWidth: theme.sizes.container.form,
                width: '100%',
                backgroundColor: theme.colors.white,
                borderRadius: theme.sizes.borderRadius.medium,
                boxShadow: theme.shadows.lg,
                overflow: 'hidden'
            }}>
                <div style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    padding: theme.sizes.spacing.lg,
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontFamily: theme.fonts.heading,
                        margin: 0,
                        fontSize: '1.8rem'
                    }}>
                        Enrollment Fee Payment
                    </h1>
                    <p style={{
                        margin: `${theme.sizes.spacing.sm} 0 0`,
                        opacity: 0.9
                    }}>
                        Assessment Number: {assessmentNumber}
                    </p>
                </div>
                
                {paymentStatus === 'pending' && (
                    <div style={{
                        padding: theme.sizes.spacing.xl,
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '40px',
                            height: '40px',
                            border: '4px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '50%',
                            borderTopColor: theme.colors.primary,
                            animation: 'spin 1s ease-in-out infinite',
                            marginBottom: theme.sizes.spacing.md
                        }}></div>
                        <p>Processing payment...</p>
                    </div>
                )}
                
                {paymentStatus === 'success' && (
                    <div style={{
                        padding: theme.sizes.spacing.xl,
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '40px',
                            height: '40px',
                            backgroundColor: theme.colors.success,
                            borderRadius: '50%',
                            marginBottom: theme.sizes.spacing.md,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: theme.colors.white,
                            fontSize: '1.5rem'
                        }}>
                            ✓
                        </div>
                        <p>Payment successful! Redirecting to enrollment form...</p>
                    </div>
                )}
                
                {paymentStatus === 'failed' && (
                    <div style={{
                        padding: theme.sizes.spacing.lg,
                        textAlign: 'center',
                        color: theme.colors.error
                    }}>
                        <p>Payment failed. Please try again.</p>
                        {errors.payment && (
                            <p>{errors.payment}</p>
                        )}
                        <button
                            onClick={() => {
                                setPaymentStatus(null);
                                clearError();
                            }}
                            style={{
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.white,
                                border: 'none',
                                padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                                borderRadius: theme.sizes.borderRadius.small,
                                cursor: 'pointer',
                                fontFamily: theme.fonts.main,
                                fontWeight: 600,
                                marginTop: theme.sizes.spacing.md
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}
                
                {!paymentStatus && (
                    <form onSubmit={handlePaymentSubmit} style={{
                        padding: theme.sizes.spacing.xl
                    }}>
                        <div style={{
                            backgroundColor: theme.colors.gray[100],
                            padding: theme.sizes.spacing.lg,
                            borderRadius: theme.sizes.borderRadius.small,
                            marginBottom: theme.sizes.spacing.lg,
                            textAlign: 'center'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: theme.colors.text
                            }}>
                                Enrollment Fee: <span style={{ color: theme.colors.primary }}>K{paymentDetails.amount}</span>
                            </p>
                        </div>
                        
                        <div style={{ marginBottom: theme.sizes.spacing.lg }}>
                            <label style={{
                                display: 'block',
                                marginBottom: theme.sizes.spacing.sm,
                                fontWeight: 600,
                                color: theme.colors.text
                            }}>
                                Payment Method
                            </label>
                            <select
                                value={paymentDetails.method}
                                onChange={(e) => handlePaymentChange('method', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: theme.sizes.spacing.sm,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.sizes.borderRadius.small,
                                    fontFamily: theme.fonts.main
                                }}
                            >
                                <option value="card">Credit/Debit Card</option>
                                <option value="mobile">Mobile Money</option>
                            </select>
                        </div>
                        
                        {paymentDetails.method === 'card' ? (
                            <>
                                <div style={{ marginBottom: theme.sizes.spacing.lg }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: theme.sizes.spacing.sm,
                                        fontWeight: 600,
                                        color: theme.colors.text
                                    }}>
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        style={{
                                            width: '100%',
                                            padding: theme.sizes.spacing.sm,
                                            border: `1px solid ${errors.cardNumber ? theme.colors.error : theme.colors.border}`,
                                            borderRadius: theme.sizes.borderRadius.small,
                                            fontFamily: theme.fonts.main
                                        }}
                                    />
                                    {errors.cardNumber && (
                                        <div style={{
                                            color: theme.colors.error,
                                            fontSize: '0.875rem',
                                            marginTop: theme.sizes.spacing.sm
                                        }}>
                                            {errors.cardNumber}
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{ display: 'flex', gap: theme.sizes.spacing.md, marginBottom: theme.sizes.spacing.lg }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: theme.sizes.spacing.sm,
                                            fontWeight: 600,
                                            color: theme.colors.text
                                        }}>
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentDetails.expiryDate}
                                            onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            style={{
                                                width: '100%',
                                                padding: theme.sizes.spacing.sm,
                                                border: `1px solid ${errors.expiryDate ? theme.colors.error : theme.colors.border}`,
                                                borderRadius: theme.sizes.borderRadius.small,
                                                fontFamily: theme.fonts.main
                                            }}
                                        />
                                        {errors.expiryDate && (
                                            <div style={{
                                                color: theme.colors.error,
                                                fontSize: '0.875rem',
                                                marginTop: theme.sizes.spacing.sm
                                            }}>
                                                {errors.expiryDate}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: theme.sizes.spacing.sm,
                                            fontWeight: 600,
                                            color: theme.colors.text
                                        }}>
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentDetails.cvv}
                                            onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                                            placeholder="123"
                                            maxLength="4"
                                            style={{
                                                width: '100%',
                                                padding: theme.sizes.spacing.sm,
                                                border: `1px solid ${errors.cvv ? theme.colors.error : theme.colors.border}`,
                                                borderRadius: theme.sizes.borderRadius.small,
                                                fontFamily: theme.fonts.main
                                            }}
                                        />
                                        {errors.cvv && (
                                            <div style={{
                                                color: theme.colors.error,
                                                fontSize: '0.875rem',
                                                marginTop: theme.sizes.spacing.sm
                                            }}>
                                                {errors.cvv}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: theme.sizes.spacing.lg }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: theme.sizes.spacing.sm,
                                        fontWeight: 600,
                                        color: theme.colors.text
                                    }}>
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.cardholderName}
                                        onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                                        placeholder="John Doe"
                                        style={{
                                            width: '100%',
                                            padding: theme.sizes.spacing.sm,
                                            border: `1px solid ${errors.cardholderName ? theme.colors.error : theme.colors.border}`,
                                            borderRadius: theme.sizes.borderRadius.small,
                                            fontFamily: theme.fonts.main
                                        }}
                                    />
                                    {errors.cardholderName && (
                                        <div style={{
                                            color: theme.colors.error,
                                            fontSize: '0.875rem',
                                            marginTop: theme.sizes.spacing.sm
                                        }}>
                                            {errors.cardholderName}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: theme.sizes.spacing.lg }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: theme.sizes.spacing.sm,
                                    fontWeight: 600,
                                    color: theme.colors.text
                                }}>
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={paymentDetails.mobileNumber}
                                    onChange={(e) => handlePaymentChange('mobileNumber', e.target.value)}
                                    placeholder="0977123456"
                                    style={{
                                        width: '100%',
                                        padding: theme.sizes.spacing.sm,
                                        border: `1px solid ${errors.mobileNumber ? theme.colors.error : theme.colors.border}`,
                                        borderRadius: theme.sizes.borderRadius.small,
                                        fontFamily: theme.fonts.main
                                    }}
                                />
                                {errors.mobileNumber && (
                                    <div style={{
                                        color: theme.colors.error,
                                        fontSize: '0.875rem',
                                        marginTop: theme.sizes.spacing.sm
                                    }}>
                                        {errors.mobileNumber}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                backgroundColor: isLoading ? theme.colors.gray[300] : theme.colors.success,
                                color: theme.colors.white,
                                border: 'none',
                                padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.lg}`,
                                borderRadius: theme.sizes.borderRadius.small,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontFamily: theme.fonts.main,
                                fontWeight: 600,
                                width: '100%',
                                fontSize: '1rem'
                            }}
                        >
                            {isLoading ? 'Processing...' : `Pay K${paymentDetails.amount}`}
                        </button>
                        
                        <div style={{
                            marginTop: theme.sizes.spacing.md,
                            fontSize: '0.875rem',
                            color: theme.colors.textLight,
                            textAlign: 'center'
                        }}>
                            Your payment information is secure and encrypted
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
    
    // Render enrollment form
    const renderEnrollmentForm = () => (
        <AdmissionForm assessmentNumber={assessmentNumber} />
    );
    
    return (
        <div>
            {currentStep === 'assessment' && renderAssessmentForm()}
            {currentStep === 'payment' && renderPaymentForm()}
            {currentStep === 'enrollment' && renderEnrollmentForm()}
        </div>
    );
};

export default EnrollmentFlow;