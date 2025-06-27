import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // force HTTPS
});

/**
 * Uploads a file to Cloudinary
 * @param {Object} file - File object with buffer and originalname
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = (file, folder = 'literacy-tree') => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: 'auto',
      public_id: file.originalname.replace(/\.[^/.]+$/, ""),
      overwrite: true,
      transformation: { quality: 'auto:good' }
    };

    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return reject(new Error('Failed to upload file to Cloudinary'));
      }
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type
      });
    }).end(file.buffer);
  });
};

/**
 * Deletes a file from Cloudinary
 * @param {String} publicId - The public ID of the file
 * @param {String} resourceType - Type of resource ('image', 'video', 'raw')
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export const deleteFromCloudinary = (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  });
};

export default cloudinary;