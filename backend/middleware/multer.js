const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinaryConfig'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (req, res, next) => {

  if (req.file) {
    try {
      const filePath = path.resolve(req.file.path);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'profiles', 
      });

      req.body.profileImage = result.secure_url; 
      fs.unlinkSync(filePath); 
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }
  }

  
  if (req.files && req.files.length > 0) {
    try {
      const uploadedImages = [];

      for (const file of req.files) {
        const filePath = path.resolve(file.path);

        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'uploads',
        });

        uploadedImages.push(result.secure_url); 
        fs.unlinkSync(filePath); 
      }

      req.body.images = uploadedImages; 
    } catch (err) {
      console.error('Error uploading multiple files to Cloudinary:', err);
      return res.status(500).json({ error: 'Failed to upload images to Cloudinary' });
    }
  }

  next(); 
};

module.exports = {
  upload,
  uploadToCloudinary,
};
