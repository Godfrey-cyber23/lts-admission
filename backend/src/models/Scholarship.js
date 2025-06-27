import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibilityCriteria: { type: String, required: true },
  coverage: { 
    type: String, 
    enum: ['full', 'partial'], 
    required: true 
  },
  amount: { type: Number },
  percentage: { type: Number },
  availableFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  applicationDeadline: { type: Date },
  isActive: { type: Boolean, default: true },
  documentsRequired: [{ type: String }]
}, {
  timestamps: true
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship;