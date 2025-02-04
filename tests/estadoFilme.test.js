import request from "supertest";
import app from "../src/server.js";

describe("Testes de Validação de Estados do Filme", () => {
  let filmeId;

  beforeAll(async () => {
    // Criando um novo filme para testar mudanças de estado
    const res = await request(app)
      .post("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ titulo: "Inception" });

    filmeId = res.body._id;
  });

  it("Não deve permitir avaliar um filme antes de assisti-lo", async () => {
    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Avaliado" });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBe(
      "O filme deve ser assistido antes de ser avaliado."
    );
  });

  it("Não deve permitir recomendar um filme antes de ser avaliado", async () => {
    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Recomendado" });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBe(
      "O filme deve ser avaliado antes de ser recomendado."
    );
  });
});
