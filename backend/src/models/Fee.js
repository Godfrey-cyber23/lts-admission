import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  program: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program', 
    required: [true, 'Program reference is required'],
    validate: {
      validator: async function(value) {
        const program = await mongoose.model('Program').findById(value);
        return program !== null;
      },
      message: 'Invalid program reference'
    }
  },
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Please use format YYYY-YYYY']
  },
  tuitionFee: { 
    type: Number, 
    required: [true, 'Tuition fee is required'],
    min: [0, 'Tuition fee cannot be negative']
  },
  registrationFee: { 
    type: Number,
    min: [0, 'Registration fee cannot be negative'],
    default: 0
  },
  developmentFee: { 
    type: Number,
    min: [0, 'Development fee cannot be negative'],
    default: 0
  },
  otherFees: [{
    name: { 
      type: String,
      required: [true, 'Fee name is required'],
      trim: true
    },
    amount: { 
      type: Number,
      required: [true, 'Fee amount is required'],
      min: [0, 'Fee amount cannot be negative']
    },
    description: { 
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    }
  }],
  paymentPlans: [{
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true
    },
    installments: [{
      dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
        validate: {
          validator: function(value) {
            return value > new Date();
          },
          message: 'Due date must be in the future'
        }
      },
      amount: {
        type: Number,
        required: [true, 'Installment amount is required'],
        min: [0, 'Installment amount cannot be negative']
      }
    }]
  }],
  discountPolicy: { 
    type: String,
    trim: true,
    maxlength: [500, 'Discount policy cannot exceed 500 characters']
  },
  effectiveFrom: { 
    type: Date, 
    required: [true, 'Effective from date is required'],
    validate: {
      validator: function(value) {
        return !this.effectiveUntil || value < this.effectiveUntil;
      },
      message: 'Effective from date must be before effective until date'
    }
  },
  effectiveUntil: { 
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.effectiveFrom;
      },
      message: 'Effective until date must be after effective from date'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validate that payment plan installments sum to total fees
feeSchema.pre('save', function(next) {
  if (this.paymentPlans && this.paymentPlans.length > 0) {
    for (const plan of this.paymentPlans) {
      const totalPlanAmount = plan.installments.reduce((sum, inst) => sum + inst.amount, 0);
      const totalFees = this.tuitionFee + this.registrationFee + this.developmentFee + 
                       (this.otherFees?.reduce((sum, fee) => sum + fee.amount, 0) || 0);
      
      if (Math.abs(totalPlanAmount - totalFees) > 0.01) {
        throw new Error(`Payment plan "${plan.name}" installments must sum to total fees`);
      }
    }
  }
  next();
});

// Indexes for better query performance
feeSchema.index({ program: 1, academicYear: 1 }, { unique: true });
feeSchema.index({ effectiveFrom: 1 });
feeSchema.index({ effectiveUntil: 1 });

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;