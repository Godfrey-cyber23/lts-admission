import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A club must have a name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Club name must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'A club must have a description'],
    trim: true
  },
  meetingSchedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Meeting day is required']
    },
    time: {
      type: String,
      required: [true, 'Meeting time is required']
    },
    frequency: {
      type: String,
      enum: ['Weekly', 'Bi-weekly', 'Monthly'],
      default: 'Weekly'
    }
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A club must have a supervisor']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
clubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual populate for club events
clubSchema.virtual('events', {
  ref: 'Event',
  foreignField: 'club',
  localField: '_id'
});

// Query middleware to filter out inactive clubs
clubSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const Club = mongoose.model('Club', clubSchema);

export default Club;