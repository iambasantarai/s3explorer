import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

export const serverPort = process.env.API_PORT || 8000;

export const awsCredentials = {
  s3BucketName: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  basePrefix: process.env.AWS_S3_BASE_PREFIX,
};

export const fileUploadConfig = {
  uploadDirectory: process.env.UPLOAD_DIR,
  maxFileSize: parseInt(process.env.MAX_FILE_SIXE as string, 10),
};

export const loggingConfig = {
  dir: process.env.LOG_PATH ?? path.join(__dirname, "..", "..", "logs"),
  server: {
    level: process.env.LOG_LEVEL ?? "info",
    logFileName: "server.log",
    errorFileName: "server-error.log",
  },
};
