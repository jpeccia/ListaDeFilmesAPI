import request from "supertest";
import app from "../src/server.js";

describe("Endpoint de Logs", () => {
  it("deve retornar os logs registrados (GET /logs)", async () => {
    const res = await request(app)
      .get("/logs")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
