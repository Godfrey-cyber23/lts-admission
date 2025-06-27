import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // force HTTPS
});

// Set up storage engine with enhanced options
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).substring(1).toLowerCase();
    const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    
    if (!allowedFormats.includes(ext)) {
      throw new Error('Unsupported file format');
    }

    return {
      folder: `literacy-tree/${req.user?.role || 'public'}`,
      format: ext === 'pdf' ? 'pdf' : 'jpg',
      public_id: `${path.parse(file.originalname).name}-${Date.now()}`,
      resource_type: ext === 'pdf' ? 'raw' : 'image',
      transformation: ext !== 'pdf' ? [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' }
      ] : undefined
    };
  }
});

// File validation function
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|gif|pdf/i;
  const extname = filetypes.test(path.extname(file.originalname));
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Error: Only images (JPEG, PNG, GIF) and PDFs are allowed!'), false);
};

// Initialize upload with enhanced options
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum number of files
  },
  fileFilter: fileFilter,
  onError: (err, next) => {
    console.error('Upload error:', err);
    next(err);
  }
});

// Add error handling middleware
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large (max 5MB)' 
        : 'File upload error'
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'File upload failed'
    });
  }
  next();
};

export default upload;