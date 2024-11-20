import request from "supertest";
import app from "../index";

const API_PREFIX = "/api";

describe("GET /heartbeat", () => {
  test("Should respond with content type 'json' and status code 200", async () => {
    await request(app)
      .get(API_PREFIX + "/heartbeat")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
