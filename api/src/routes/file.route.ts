import { Router } from "express";
import fileController from "../controllers/file.controller";
import uploadFile from "../middlewares/fileUpload.middleware";

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
 *              destinationDirectory:
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
router.post("/", uploadFile().array("files"), fileController.uploadFile);

/**
 * @openapi
 * '/api/explorer/files':
 *  put:
 *    tags:
 *      - File management
 *    description: Request for updating file in s3 bucket.
 *    responses:
 *      200:
 */
router.put("/");

/**
 * @openapi
 * '/api/explorer/files':
 *  delete:
 *    tags:
 *      - File management
 *    description: Request for deleting file in s3 bucket.
 *    responses:
 *      200:
 */
router.delete("/");

export default router;
