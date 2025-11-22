// src/context/PaymentProvider.js
import React, { createContext, useContext, useReducer } from 'react';
import PaymentService from '../services/PaymentService';

// Initial state
const initialState = {
    currentPayment: null,
    paymentHistory: [],
    isLoading: false,
    error: null
};

// Action types
const PAYMENT_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CURRENT_PAYMENT: 'SET_CURRENT_PAYMENT',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const paymentReducer = (state, action) => {
    switch (action.type) {
        case PAYMENT_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case PAYMENT_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case PAYMENT_ACTIONS.SET_CURRENT_PAYMENT:
            return {
                ...state,
                currentPayment: action.payload,
                isLoading: false,
                error: null
            };
        case PAYMENT_ACTIONS.ADD_TO_HISTORY:
            return {
                ...state,
                paymentHistory: [action.payload, ...state.paymentHistory],
                isLoading: false,
                error: null
            };
        case PAYMENT_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const PaymentContext = createContext();

// Provider component
export const PaymentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, initialState);

    // Actions
    const setLoading = (loading) => {
        dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: loading });
    };

    const setError = (error) => {
        dispatch({ type: PAYMENT_ACTIONS.SET_ERROR, payload: error });
    };

    const clearError = () => {
        dispatch({ type: PAYMENT_ACTIONS.CLEAR_ERROR });
    };

    const verifyAssessment = async (assessmentNumber) => {
        setLoading(true);
        clearError();
        
        try {
            const result = await PaymentService.verifyAssessment(assessmentNumber);
            return result;
        } catch (error) {
            setError(error.message || 'Failed to verify assessment');
            throw error;
        }
    };

    const processPayment = async (paymentData) => {
        setLoading(true);
        clearError();
        
        try {
            const result = await PaymentService.processPayment(paymentData);
            dispatch({ type: PAYMENT_ACTIONS.SET_CURRENT_PAYMENT, payload: result });
            dispatch({ type: PAYMENT_ACTIONS.ADD_TO_HISTORY, payload: result });
            return result;
        } catch (error) {
            setError(error.message || 'Payment failed');
            throw error;
        }
    };

    const getPaymentStatus = async (transactionId) => {
        setLoading(true);
        clearError();
        
        try {
            const result = await PaymentService.getPaymentStatus(transactionId);
            return result;
        } catch (error) {
            setError(error.message || 'Failed to get payment status');
            throw error;
        }
    };

    const value = {
        ...state,
        verifyAssessment,
        processPayment,
        getPaymentStatus,
        clearError
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};

// Hook to use payment context
export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};