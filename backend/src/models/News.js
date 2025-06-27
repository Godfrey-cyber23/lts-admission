import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  publishDate: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);
export default News;