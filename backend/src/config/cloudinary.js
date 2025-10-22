import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a file to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
        format: path.extname(file.originalname).substring(1),
        transformation: {
          quality: 'auto:good',
          width: 1200,
          height: 1200,
          crop: 'limit'
        }
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary
 * @param {String} publicId - The public ID of the file
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};