import fs from "node:fs";
import multer, { StorageEngine } from "multer";
import { fileUploadConfig } from "../utils/env.util";
import { Request } from "express";
// import path from 'node:path';

const uploadDir = fileUploadConfig.uploadDirectory || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const createStorage = (): StorageEngine => {
  return multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
      // Organize uploads by date
      // const date = new Date().toISOString().split('T')[0];
      // const uploadPath = path.join(uploadDir, date);
      // if (!fs.existsSync(uploadPath)) {
      //   fs.mkdirSync(uploadPath, { recursive: true });
      // }

      cb(null, uploadDir);
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
      cb(null, file.originalname);
    },
  });
};

const createFileFilter = () => {
  //TODO: you can make them configurable through environment variables or a config file
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];

  return (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.originalname));
    }
  };
};

const uploadFile = () => {
  return multer({
    storage: createStorage(),
    fileFilter: createFileFilter(),
    limits: {
      fileSize: fileUploadConfig.maxFileSize || 5 * 1024 * 1024, // Max file size (default: 5MB)
    },
  });
};

export default uploadFile;
