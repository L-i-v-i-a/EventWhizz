const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require("dotenv")

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
const uploadToCloudinary = (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);  
            }
        });
    });
};

module.exports = { uploadToCloudinary };
