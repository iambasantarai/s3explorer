import { Router } from "express";
import directoryController from "../controllers/directory.controller";

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
router.post("/", directoryController.createDirectory);

/**
 * @openapi
 * '/api/explorer/directories':
 *  put:
 *    tags:
 *      - Directory management
 *    description: Request for updating directory in s3 bucket.
 *    responses:
 *      200:
 */
router.put("/");

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
router.delete("/", directoryController.deleteDirectory);

export default router;
