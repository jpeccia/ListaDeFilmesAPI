import request from "supertest";
import app from "../src/server.js";

describe("Middleware de Logs", () => {
  it("Deve registrar um log ao acessar um endpoint", async () => {
    const res = await request(app)
      .get("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    expect(res.status).toBe(200);
  });
});
