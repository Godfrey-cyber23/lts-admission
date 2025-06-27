import Admission from '../models/Admission.js';
import Inquiry from '../models/Inquiry.js';
import Event from '../models/Event.js';
import catchAsync from '../utils/catchAsync.js';

export const getStats = catchAsync(async (req, res) => {
  // Get admission statistics
  const admissionStats = await Admission.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Convert to object format
  const admissions = {};
  admissionStats.forEach(stat => {
    admissions[stat._id] = stat.count;
  });
  
  // Get inquiry statistics
  const inquiryStats = await Inquiry.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const inquiries = {};
  inquiryStats.forEach(stat => {
    inquiries[stat._id] = stat.count;
  });
  
  // Get upcoming events
  const upcomingEvents = await Event.find({
    startDate: { $gte: new Date() }
  }).sort('startDate').limit(5);
  
  // Get recent admissions
  const recentAdmissions = await Admission.find()
    .sort('-createdAt')
    .limit(5)
    .populate('assignedTo', 'firstName lastName');
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        admissions,
        inquiries,
        totalAdmissions: admissionStats.reduce((sum, stat) => sum + stat.count, 0),
        totalInquiries: inquiryStats.reduce((sum, stat) => sum + stat.count, 0)
      },
      upcomingEvents,
      recentAdmissions
    }
  });
});

const dashboardController = {
  getStats
};

export default dashboardController;