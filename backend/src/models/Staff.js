import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  department: { 
    type: String, 
    enum: ['administration', 'academics', 'support'], 
    required: true 
  },
  bio: { type: String },
  qualifications: [{ type: String }],
  subjects: [{ type: String }],
  email: { type: String },
  phone: { type: String },
  photo: { type: String },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;