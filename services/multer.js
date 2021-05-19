const multer = require('multer');

// use memory storage
const storage = multer.memoryStorage();

const ALLOWED_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (ALLOWED_FILE_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Ooops, file format not supported!'), false);
    }
  },
});

module.exports = upload;
