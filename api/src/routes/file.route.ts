import { Router } from "express";
import fileController from "../controllers/file.controller";
import uploadFile from "../middlewares/fileUpload.middleware";
import { validateSchema } from "../middlewares/validation.milddleware";
import fileSchema from "../schemas/file.schema";

const router = Router();

/**
 * @openapi
 * '/api/explorer/files':
 *  get:
 *    tags:
 *      - File management
 *    description: Request for downloading file from s3 bucket.
 *    responses:
 *      200:
 */
router.get("/");

/**
 * @openapi
 * '/api/explorer/files':
 *  post:
 *    tags:
 *      - File management
 *    description: Request for uploading files in s3 bucket.
 *    requestBody:
 *      description: The files to be uploaded.
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              directory:
 *                type: string
 *              files:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *                  description: The source files to be uploaded (PDF, Word, image, etc.)
 *    responses:
 *      200:
 *        description: Success message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Files uploaded successfully.
 *      400:
 *        description: Invalid file upload request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: No files uploaded or invalid file types.
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: An error occurred during file upload.
 */
router.post(
  "/",
  uploadFile().array("files"),
  validateSchema(fileSchema.upload),
  fileController.uploadFile,
);

/**
 * @openapi
 * '/api/explorer/files':
 *  put:
 *    tags:
 *      - File management
 *    description: Request for renaming a file in the S3 bucket.
 *    requestBody:
 *      description: Information about the file to be renamed.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              directory:
 *                type: string
 *                description: The directory where the file is located.
 *              oldFileName:
 *                type: string
 *                description: The current name of the file.
 *              newFileName:
 *                type: string
 *                description: The new name for the file.
 *            required:
 *              - directory
 *              - oldFileName
 *              - newFileName
 *    responses:
 *      200:
 *        description: Success message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: File renamed successfully.
 *      400:
 *        description: Invalid file update request.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: No file found with such name.
 *      500:
 *        description: Internal server error.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: An error occurred during file update.
 */
router.put("/", validateSchema(fileSchema.rename), fileController.updateFile);

/**
 * @openapi
 * '/api/explorer/files':
 *  delete:
 *    tags:
 *      - File management
 *    description: Delete files from S3 bucket.
 *    requestBody:
 *      description: The file paths to delete.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              directory:
 *                type: string
 *                description: The directory where the file is located.
 *              files:
 *                type: array
 *                items:
 *                  type: string
 *            required:
 *              - destination
 *              - files
 *    responses:
 *      200:
 *        description: Success message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Files have been deleted successfully.
 *      400:
 *        description: Invalid delete request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: No file paths provided.
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: An error occurred during file deletion.
 */
router.delete(
  "/",
  validateSchema(fileSchema.remove),
  fileController.deleteFile,
);

export default router;
