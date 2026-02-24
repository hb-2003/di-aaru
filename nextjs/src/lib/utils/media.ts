import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(fileStr: string, folder: string = 'diaaru') {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder,
    });

    return {
      publicId: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
      bytes: uploadResponse.bytes,
      resourceType: uploadResponse.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export default cloudinary;
