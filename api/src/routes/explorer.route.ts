import { Router } from "express";

import directoryRoutes from "./directory.route";
import fileRoutes from "./file.route";
import explorerController from "../controllers/explorer.controller";

const router = Router();

/**
 * @openapi
 * '/api/explorer/list-all':
 *  get:
 *    tags:
 *      - File Explorer
 *    description: Request for file explorer to list all objects.
 *
 *    parameters:
 *      - name: nextRootDirectory
 *        in: query
 *        description: Next root directory
 *        required: false
 *        schema:
 *          type: string
 *      - name: continuationToken
 *        in: query
 *        description: Continuation token for pagination
 *        required: false
 *        schema:
 *          type: string
 *      - name: maxKeys
 *        in: query
 *        description: Maximum number of keys returned in the response
 *        required: false
 *        schema:
 *          type: integer
 *          format: int32
 *    responses:
 *      200:
 *        description: List of objects from S3 bucket
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      key:
 *                        type: string
 *                      lastModified:
 *                        type: string
 *                        format: date-time
 *                      size:
 *                        type: integer
 *                        format: int64
 *                currentPath:
 *                  type: string
 *                continuationToken:
 *                  type: string
 *                isTruncated:
 *                  type: boolean
 */
router.get("/list-all", explorerController.listAll);

router.use("/directories", directoryRoutes);
router.use("/files", fileRoutes);

export default router;
