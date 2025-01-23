const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}), // In-memory storage, or specify a location if needed
  fileFilter: (req, file, cb) => {
    if (file) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (
        ![".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4"].includes(
          ext
        )
      ) {
        return cb(new Error("File type is not supported"), false);
      }
    }
    cb(null, true); // Allow the file (or allow the request even if no file is present)
  },
});
