const multer = require('multer');
const path = require('path');
const tempDir = path.join(__dirname, '../Public/Images');

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, tempDir);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

module.exports = multer({ storage: diskStorage }).single('file');
