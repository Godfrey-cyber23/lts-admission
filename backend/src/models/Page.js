import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  lastUpdatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Add slug generation before saving
pageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  }
  next();
});

const Page = mongoose.model('Page', pageSchema);

export default Page;