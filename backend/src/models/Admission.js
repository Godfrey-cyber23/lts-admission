import mongoose from 'mongoose';

/**
 * @typedef {object} SupabaseDocument
 * @property {string} path - The file path in the Supabase bucket (e.g., 'public/uuid-filename.jpg'). This is the primary identifier.
 * @property {string} publicUrl - The full public URL for accessing the file.
 * @property {string} [bucketId] - The ID of the Supabase bucket.
 * @property {string} [fileName] - The original name of the uploaded file.
 * @property {string} [mimeType] - The MIME type of the file (e.g., 'image/jpeg').
 * @property {number} [size] - The size of the file in bytes.
 * @property {Date} [uploadedAt] - Timestamp of when the file was uploaded.
 */

// NEW: Schema for documents stored in Supabase
const supabaseDocumentSchema = new mongoose.Schema({
  path: { 
    type: String, 
    required: [true, 'Document path is required'],
    trim: true
  },
  publicUrl: { 
    type: String, 
    required: [true, 'Document public URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: props => `${props.value} is not a valid URL`
    }
  },
  bucketId: { 
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  mimeType: {
    type: String,
    trim: true
  },
  size: {
    type: Number
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false }); // No need for a separate ID for sub-documents

const admissionSchema = new mongoose.Schema({
  childInfo: {
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    surname: { 
      type: String, 
      required: [true, 'Surname is required'],
      trim: true,
      maxlength: [50, 'Surname cannot exceed 50 characters']
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
    age: { 
      type: Number,
      min: [1, 'Age must be at least 1'],
      max: [18, 'Age cannot exceed 18']
    },
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
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    mothersName: { 
      type: String,
      trim: true
    },
    mothersContact: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
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
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    emergencyContacts: [{ 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    }]
  },
  // UPDATED: Using the new Supabase document schema
  documents: {
    passportPhoto: { 
      type: supabaseDocumentSchema,
      required: [true, 'Passport photo is required']
    },
    underFiveCard: supabaseDocumentSchema,
    birthCertificate: supabaseDocumentSchema
  },
  declaration: {
    declarationName: { 
      type: String,
      trim: true,
      required: [true, 'Declaration name is required']
    },
    signatureData: { 
      type: String,
      required: [true, 'Signature is required'],
      validate: {
        validator: function(v) {
          return v.startsWith('data:image/');
        },
        message: 'Invalid signature format'
      }
    }
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
  // In Mongoose, embedding notes is a common and efficient pattern
  notes: [{
    content: { 
      type: String, 
      required: [true, 'Note content is required'],
      trim: true
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
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

// Virtuals remain the same and are very useful
admissionSchema.virtual('assignedUser', {
  ref: 'User',
  localField: 'assignedTo',
  foreignField: '_id',
  justOne: true
});

admissionSchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

// Pre-save hook to calculate age is perfect, keep it
admissionSchema.pre('save', function(next) {
  if (this.childInfo.dob && !this.childInfo.age) {
    const dob = new Date(this.childInfo.dob);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    this.childInfo.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

// UPDATED: Indexes for performance
admissionSchema.index({ status: 1 });
admissionSchema.index({ createdBy: 1 }); // Good for finding applications by a user
admissionSchema.index({ 'childInfo.firstName': 'text', 'childInfo.surname': 'text' });
admissionSchema.index({ createdAt: -1 });
// Index for the new document path
admissionSchema.index({ 'documents.passportPhoto.path': 1 });

const Admission = mongoose.model('Admission', admissionSchema);
export default Admission;