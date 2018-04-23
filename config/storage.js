/**
 * Storage Configurations
 */

const multer = require('multer');
const path = require('path');

// Storage Configs
module.exports.profilePictureStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './user_assets/profile_picture');
  },
    filename: (req, file, callback) => {
      callback(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });

module.exports.AnotherStorageConfig = multer.diskStorage({
});

// Filters
module.exports.jpegFileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
