import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: { 
    type: String,
    trim: true,
    match: [/^[\d\s+-]+$/, 'Please provide a valid phone number']
  },
  subject: { 
    type: String, 
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: { 
    type: String, 
    enum: {
      values: ['new', 'in-progress', 'resolved'],
      message: 'Invalid status value'
    },
    default: 'new'
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: async function(value) {
        if (!value) return true;
        const user = await mongoose.model('User').findById(value);
        return user && ['admin', 'staff'].includes(user.role);
      },
      message: 'Assigned user must be admin or staff'
    }
  },
  response: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Response cannot exceed 2000 characters']
  },
  responseDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value <= new Date();
      },
      message: 'Response date cannot be in the future'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
inquirySchema.index({ status: 1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ createdAt: -1 });

// Pre-save hook to update response date
inquirySchema.pre('save', function(next) {
  if (this.isModified('response') && this.response && !this.responseDate) {
    this.responseDate = new Date();
  }
  next();
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;