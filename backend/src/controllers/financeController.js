import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

export const getAllPayments = catchAsync(async (req, res, next) => {
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      student:students(admission:admissions(childFirstName, childSurname)),
      collected_by:users(firstName, lastName)
    `)
    .order('payment_date', { ascending: false });

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payments: payments || []
    }
  });
});

export const getPayment = catchAsync(async (req, res, next) => {
  const { data: payment, error } = await supabase
    .from('payments')
    .select(`
      *,
      student:students(*, admission:admissions(*)),
      collected_by:users(*)
    `)
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No payment found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

export const createPayment = catchAsync(async (req, res, next) => {
  const {
    student_id,
    amount,
    payment_date,
    due_date,
    payment_method,
    payment_type,
    description,
    status
  } = req.body;

  // Validate required fields
  if (!student_id || !amount || !payment_type) {
    return next(new AppError('Student ID, amount, and payment type are required', 400));
  }

  const paymentData = {
    student_id,
    amount,
    payment_date: payment_date || new Date().toISOString().split('T')[0],
    due_date: due_date || null,
    payment_method: payment_method || 'cash',
    payment_type,
    description: description || '',
    status: status || 'completed',
    collected_by: req.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newPayment, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select(`
      *,
      student:students(admission:admissions(childFirstName, childSurname))
    `)
    .single();

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(201).json({
    status: 'success',
    data: {
      payment: newPayment
    }
  });
});

export const updatePayment = catchAsync(async (req, res, next) => {
  const {
    amount,
    payment_date,
    due_date,
    payment_method,
    payment_type,
    description,
    status
  } = req.body;

  const updateData = {
    amount,
    payment_date,
    due_date,
    payment_method,
    payment_type,
    description,
    status,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: updatedPayment, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', req.params.id)
    .select(`
      *,
      student:students(admission:admissions(childFirstName, childSurname))
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No payment found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment: updatedPayment
    }
  });
});

export const getFinancialStats = catchAsync(async (req, res, next) => {
  // Get total revenue
  const { data: payments, error: paymentError } = await supabase
    .from('payments')
    .select('amount, payment_date, status');

  if (paymentError) {
    return handleSupabaseError(paymentError, next);
  }

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let pendingPayments = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (payments) {
    payments.forEach(payment => {
      if (payment.status === 'completed') {
        totalRevenue += parseFloat(payment.amount) || 0;
        
        const paymentDate = new Date(payment.payment_date);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          monthlyRevenue += parseFloat(payment.amount) || 0;
        }
      } else if (payment.status === 'pending') {
        pendingPayments += parseFloat(payment.amount) || 0;
      }
    });
  }

  // Get payments by type
  const { data: typeData, error: typeError } = await supabase
    .from('payments')
    .select('payment_type, amount, status');

  const typeStats = {};
  if (typeData && !typeError) {
    typeData.forEach(payment => {
      if (payment.status === 'completed') {
        const type = payment.payment_type;
        typeStats[type] = (typeStats[type] || 0) + (parseFloat(payment.amount) || 0);
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        byType: typeStats
      }
    }
  });
});

export const getPaymentReports = catchAsync(async (req, res, next) => {
  const { start_date, end_date, payment_type } = req.query;

  let query = supabase
    .from('payments')
    .select(`
      *,
      student:students(admission:admissions(childFirstName, childSurname)),
      collected_by:users(firstName, lastName)
    `)
    .order('payment_date', { ascending: false });

  // Apply filters
  if (start_date) {
    query = query.gte('payment_date', start_date);
  }

  if (end_date) {
    query = query.lte('payment_date', end_date);
  }

  if (payment_type) {
    query = query.eq('payment_type', payment_type);
  }

  const { data: payments, error } = await query;

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payments: payments || [],
      report: {
        total: payments?.length || 0,
        totalAmount: payments?.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) || 0
      }
    }
  });
});

const financeController = {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  getFinancialStats,
  getPaymentReports
};

export default financeController;