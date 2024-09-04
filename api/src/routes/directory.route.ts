import { Router } from "express";

const router = Router();

/**
 * @openapi
 * '/api/explorer/directories':
 *  post:
 *    tags:
 *      - Directory management
 *    description: Request for creating directory in s3 bucket.
 *    responses:
 *      200:
 */
router.post("/");

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
 *    description: Request for deleting directory in s3 bucket.
 *    responses:
 *      200:
 */
router.delete("/");

export default router;
