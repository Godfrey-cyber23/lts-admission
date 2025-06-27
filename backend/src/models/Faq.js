import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, 'FAQ question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: { 
    type: String, 
    required: [true, 'FAQ answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  category: { 
    type: String, 
    enum: {
      values: ['admission', 'academics', 'fees', 'facilities', 'general'],
      message: 'Invalid FAQ category'
    },
    required: [true, 'Category is required']
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  order: { 
    type: Number, 
    default: 0,
    min: [0, 'Order must be a positive number']
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
faqSchema.index({ category: 1, isFeatured: 1 });
faqSchema.index({ order: 1 });

// Update lastUpdated timestamp before saving
faqSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Faq = mongoose.model('Faq', faqSchema);

export default Faq;