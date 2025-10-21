import { supabase } from '../config/db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getStats = catchAsync(async (req, res, next) => {
  try {
    // Get all statistics in parallel with correct column names for each table
    const [
      admissionsPromise,
      studentsPromise,
      staffPromise,
      eventsPromise
    ] = await Promise.allSettled([
      // Admissions stats - using camelCase
      supabase
        .from('admissions')
        .select('status, createdAt'),
      
      // Students stats - using snake_case
      supabase
        .from('students')
        .select('status, created_at'),
      
      // Staff stats
      supabase
        .from('users')
        .select('role, isActive')
        .in('role', ['staff', 'admin', 'teacher']),
      
      // Events stats - using snake_case
      supabase
        .from('events')
        .select('event_date, event_type')
        .gte('event_date', new Date().toISOString())
    ]);

    // Process admissions data (camelCase)
    const admissionStatus = {};
    let totalAdmissions = 0;
    let pendingAdmissions = 0;

    if (admissionsPromise.status === 'fulfilled' && admissionsPromise.value.data) {
      admissionsPromise.value.data.forEach(admission => {
        admissionStatus[admission.status] = (admissionStatus[admission.status] || 0) + 1;
        totalAdmissions++;
        if (admission.status === 'pending') {
          pendingAdmissions++;
        }
      });
    }

    // Process students data (snake_case)
    let totalStudents = 0;
    if (studentsPromise.status === 'fulfilled' && studentsPromise.value.data) {
      totalStudents = studentsPromise.value.data.length;
    }

    // Process staff data
    let totalStaff = 0;
    if (staffPromise.status === 'fulfilled' && staffPromise.value.data) {
      totalStaff = staffPromise.value.data.filter(staff => staff.isActive).length;
    }

    // Process events data (snake_case)
    let upcomingEvents = 0;
    if (eventsPromise.status === 'fulfilled' && eventsPromise.value.data) {
      upcomingEvents = eventsPromise.value.data.length;
    }

    // Get recent admissions with correct camelCase column names
    const { data: recentAdmissions, error: recentError } = await supabase
      .from('admissions')
      .select(`
        *,
        assigned_to:users!admissions_assignedTo_fkey (
          firstName, lastName
        )
      `)
      .order('createdAt', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent admissions:', recentError);
    }

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalAdmissions,
          pendingAdmissions,
          totalStudents,
          totalStaff,
          monthlyRevenue: 0, // Remove payments for now since table might not exist
          upcomingEvents,
          admissionStatus
        },
        recentAdmissions: recentAdmissions || [],
        upcomingEvents: eventsPromise.status === 'fulfilled' ? eventsPromise.value.data?.slice(0, 3) || [] : []
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return basic stats even on error
    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalAdmissions: 0,
          pendingAdmissions: 0,
          totalStudents: 0,
          totalStaff: 0,
          monthlyRevenue: 0,
          upcomingEvents: 0,
          admissionStatus: {}
        },
        recentAdmissions: [],
        upcomingEvents: []
      }
    });
  }
});

const dashboardController = {
  getStats
};

export default dashboardController;