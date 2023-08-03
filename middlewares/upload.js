const path = require("path");
const multer = require("multer");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
});
const upload = multer({ storage: multerConfig });

module.exports = upload;
