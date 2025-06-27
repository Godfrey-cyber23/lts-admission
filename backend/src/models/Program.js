import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ageRange: { type: String },
  image: { type: String },
  curriculum: [{ 
    title: { type: String },
    description: { type: String }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Program = mongoose.model('Program', programSchema);

export default Program;