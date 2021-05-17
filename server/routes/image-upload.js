const express = require('express');
const { authorized } = require('../middleware/auth');
const upload = require('../services/multer');
const { transformBufferToBase64 } = require('../services/datauri');
const { uploadToCloud } = require('../services/cloudinary');
const CloudinaryImage = require('../models/cloudinary-image');

const router = express.Router();

const singleUpload = upload.single('image');

const singleUploadController = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.handleApiError({
        title: 'Upload error',
        detail: error.message,
      });
    }
    next();
  });
};

router.post('/', authorized, singleUploadController, async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Image is not presented!');
    }
    const file64 = transformBufferToBase64(req.file);
    const uploaded = await uploadToCloud(file64.content);
    // save image info to database
    const cImage = new CloudinaryImage({
      url: uploaded.secure_url,
      cloudinaryId: uploaded.public_id,
    });
    const savedImage = await cImage.save();
    return res.json({ upload: true, _id: savedImage.id, url: savedImage.url });
  } catch (error) {
    return res.handleApiError({
      title: 'Upload error',
      detail: 'Ooops, something went wrong with image upload',
    });
  }
});

module.exports = router;
