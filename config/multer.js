const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist safely
const imageDir = path.join(__dirname, '../uploads/images');
const voiceDir = path.join(__dirname, '../uploads/images/voice');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, voiceDir);
    } else {
      cb(null, imageDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;