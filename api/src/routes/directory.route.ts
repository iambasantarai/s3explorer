import { Router } from "express";
import directoryController from "../controllers/directory.controller";
import { validateSchema } from "../middlewares/validation.milddleware";
import directorySchema from "../schemas/directory.schema";

const router = Router();

/**
 * @openapi
 * '/api/explorer/directories':
 *  post:
 *    tags:
 *      - Directory management
 *    description: Request for creating a directory in s3 bucket.
 *    summary: Create a directory in the S3 bucket.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              currentPath:
 *                type: string
 *              directoryName:
 *                type: string
 *            required:
 *              - currentPath
 *              - directoryName
 *    responses:
 *      201:
 *        description: Directory created successfully in the S3 bucket
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Directory has been created successfully."
 *      400:
 *        description: Bad request, invalid input
 */
router.post(
  "/",
  validateSchema(directorySchema.create),
  directoryController.createDirectory,
);

/**
 * @openapi
 * '/api/explorer/directories':
 *  put:
 *    tags:
 *      - Directory management
 *    description: Request for updating a directory in s3 bucket.
 *    summary: Update a directory in the S3 bucket.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              currentPath:
 *                type: string
 *              oldDirectoryName:
 *                type: string
 *              newDirectoryName:
 *                type: string
 *            required:
 *              - currentPath
 *              - oldDirectoryName
 *              - newDirectoryName
 *    responses:
 *      200:
 *        description: Directory updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Directory has been updated successfully."
 *      400:
 *        description: Bad request, invalid input
 */
router.put(
  "/",
  validateSchema(directorySchema.update),
  directoryController.updateDirectory,
);

/**
 * @openapi
 * '/api/explorer/directories':
 *  delete:
 *    tags:
 *      - Directory management
 *    description: Request for deleting a directory from s3 bucket.
 *    summary: Delete a directory from the S3 bucket.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              currentPath:
 *                type: string
 *              directoryName:
 *                type: string
 *            required:
 *              - currentPath
 *              - directoryName
 *    responses:
 *      200:
 *        description: Directory deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Directory has been deleted successfully."
 *      400:
 *        description: Bad request, invalid input
 */
router.delete(
  "/",
  validateSchema(directorySchema.remove),
  directoryController.deleteDirectory,
);

export default router;
