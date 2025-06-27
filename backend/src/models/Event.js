import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return !this.endDate || value <= this.endDate;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: { 
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  eventType: { 
    type: String, 
    enum: {
      values: ['academic', 'sports', 'cultural', 'holiday', 'meeting'],
      message: 'Invalid event type'
    },
    required: [true, 'Event type is required']
  },
  audience: { 
    type: String, 
    enum: {
      values: ['all', 'staff', 'students', 'parents'],
      message: 'Invalid audience type'
    },
    default: 'all'
  },
  image: { 
    type: String,
    match: [/^https?:\/\/.+\..+$/, 'Please provide a valid image URL']
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Creator reference is required']
  },
  isRecurring: { 
    type: Boolean, 
    default: false
  },
  recurrencePattern: { 
    type: String,
    validate: {
      validator: function(value) {
        if (!this.isRecurring) return true;
        return value && ['daily', 'weekly', 'monthly', 'yearly'].includes(value);
      },
      message: 'Recurrence pattern must be specified for recurring events'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ audience: 1 });

// Virtual for event duration (in days)
eventSchema.virtual('duration').get(function() {
  if (!this.endDate) return 1;
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
});

const Event = mongoose.model('Event', eventSchema);
export default Event;