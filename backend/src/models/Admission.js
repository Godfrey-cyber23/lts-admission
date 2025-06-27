import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  childInfo: {
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true
    },
    surname: { 
      type: String, 
      required: [true, 'Surname is required'],
      trim: true
    },
    dob: { 
      type: Date, 
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(value) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    age: { type: Number },
    placeOfBirth: { 
      type: String, 
      required: [true, 'Place of birth is required'],
      trim: true
    },
    nationality: { 
      type: String, 
      required: [true, 'Nationality is required'],
      trim: true
    },
    religion: { 
      type: String,
      trim: true
    }
  },
  parentInfo: {
    fathersName: { 
      type: String,
      trim: true
    },
    fathersContact: { 
      type: String,
      trim: true
    },
    mothersName: { 
      type: String,
      trim: true
    },
    mothersContact: { 
      type: String,
      trim: true
    },
    residentialAddress: { 
      type: String, 
      required: [true, 'Residential address is required'],
      trim: true
    }
  },
  healthInfo: {
    hasAllergies: { 
      type: String, 
      enum: ['Yes', 'No'], 
      default: 'No' 
    },
    allergyDetails: { 
      type: String,
      trim: true
    },
    isVaccinated: { 
      type: String, 
      enum: ['Yes', 'No'], 
      default: 'Yes' 
    },
    vaccinationDetails: { 
      type: String,
      trim: true
    },
    doctorDetails: { 
      type: String,
      trim: true
    },
    doctorContact: { 
      type: String,
      trim: true
    },
    emergencyContacts: [{ 
      type: String,
      trim: true
    }]
  },
  documents: {
    underFiveCard: { type: String },
    passportPhoto: { type: String },
    birthCertificate: { type: String }
  },
  declaration: {
    declarationName: { 
      type: String,
      trim: true
    },
    signatureData: { type: String }
  },
  otherInfo: { 
    type: String,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'under-review', 'accepted', 'rejected', 'waitlisted'], 
    default: 'pending' 
  },
  admissionDate: { type: Date },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  notes: [{
    content: { 
      type: String, 
      required: [true, 'Note content is required'],
      trim: true
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    createdAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for assigned user details
admissionSchema.virtual('assignedUser', {
  ref: 'User',
  localField: 'assignedTo',
  foreignField: '_id',
  justOne: true
});

// Calculate age before saving
admissionSchema.pre('save', function(next) {
  if (this.childInfo.dob && !this.childInfo.age) {
    const dob = new Date(this.childInfo.dob);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    this.childInfo.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

// Indexes for better performance
admissionSchema.index({ status: 1 });
admissionSchema.index({ 'childInfo.firstName': 'text', 'childInfo.surname': 'text' });

const Admission = mongoose.model('Admission', admissionSchema);
export default Admission;