const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.random().toString(36).substring(7);
    const ext = file.mimetype.split("/")[1]; 
    cb(null, uniqueSuffix + "." + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
