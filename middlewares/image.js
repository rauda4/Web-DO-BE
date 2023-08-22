const multer = require('multer');
const path = require('path');
const tempDir = path.join(__dirname, '../Public/Images'); // Pastikan "/temp" sesuai dengan direktori penyimpanan sementara yang benar

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, tempDir);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

module.exports = multer({ storage: diskStorage }).single('thumbnail');
