import dotenv from "dotenv";
dotenv.config();

export const serverPort = process.env.PORT || 8000;

export const awsCredentials = {
  s3BucketName: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  basePrefix: process.env.AWS_S3_BASE_PREFIX,
};
