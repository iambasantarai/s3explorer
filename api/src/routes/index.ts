import { Request, Response, Router } from "express";
import explolerRoutes from "./explorer.route";

const router = Router();

/**
 * @openapi
 * '/api/heartbeat':
 *  get:
 *      tags:
 *          - Heartbeat
 *      description: Listen to the heartbeat of server
 *      responses:
 *          200:
 *              description: Heartbeat of a server
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              heartbeat:
 *                                  type: string
 */
router.get("/heartbeat", (_req: Request, res: Response) => {
  const hrtime = process.hrtime.bigint();
  res.status(200).json({ heartbeat: hrtime.toString() });
});

router.use("explorer", explolerRoutes);

export default router;
