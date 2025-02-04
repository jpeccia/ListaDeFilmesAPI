import request from "supertest";
import app from "../src/server.js";

describe("Testes de Integração", () => {
  it("Deve adicionar um filme buscando da API TMDB", async () => {
    const res = await request(app)
      .post("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ titulo: "Inception" });

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe("Inception");
  });
});
