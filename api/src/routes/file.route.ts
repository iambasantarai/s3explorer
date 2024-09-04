import { Router } from "express";

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
 *    description: Request for uploading file in s3 bucket.
 *    responses:
 *      200:
 */
router.post("/");

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
