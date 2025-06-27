import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Policy title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Policy content is required'],
    trim: true
  },
  category: { 
    type: String, 
    enum: {
      values: ['uniform', 'transportation', 'behavior', 'academic', 'other'],
      message: 'Invalid policy category'
    },
    required: [true, 'Category is required']
  },
  effectiveDate: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Effective date cannot be in the future'
    }
  },
  appliesTo: [{ 
    type: String, 
    enum: {
      values: ['students', 'staff', 'parents', 'all'],
      message: 'Invalid audience type'
    },
    required: [true, 'At least one audience is required']
  }],
  attachments: [{ 
    type: String,
    validate: {
      validator: function(value) {
        return /^https?:\/\/.+\..+$/.test(value);
      },
      message: 'Invalid attachment URL'
    }
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
policySchema.index({ category: 1 });
policySchema.index({ isActive: 1 });
policySchema.index({ effectiveDate: -1 });

const Policy = mongoose.model('Policy', policySchema);
export default Policy;