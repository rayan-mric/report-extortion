// middleware/upload.js
// This middleware handles file uploads:
//   1. multer reads the file from the incoming HTTP request (stored in memory)
//   2. uploadToS3() sends it to your S3 bucket and returns the public URL

const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const s3 = require("../config/s3");
require("dotenv").config();

// Store files in memory (as a Buffer) so we can forward them to S3
// Don't use disk storage on servers — ephemeral filesystems get wiped
const storage = multer.memoryStorage();

// Only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Only images (jpg/png/webp) and videos (mp4/mov) are allowed"), false);
  }
};

// Limit file size: images 10MB, videos 100MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
});

// Helper: upload a single file buffer to S3 and return its public URL
async function uploadToS3(file) {
  // Give every file a unique name to prevent collisions
  const ext = path.extname(file.originalname);
  const key = `reports/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // Files are publicly readable (so the frontend can display them)
    ACL: "public-read",
  });

  await s3.send(command);

  // Return the public S3 URL
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { upload, uploadToS3 };
