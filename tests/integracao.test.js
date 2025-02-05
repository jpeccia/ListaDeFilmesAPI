import request from "supertest";
import app from "../src/server.js";

describe("Testes de Integração da API", () => {
  let filmeId;

  it("Deve adicionar um filme e retornar estado inicial correto", async () => {
    const res = await request(app)
      .post("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ titulo: "Inception" });

    expect(res.status).toBe(201);
    expect(res.body.estado).toBe("A assistir");

    filmeId = res.body._id;
  });

  it('Deve permitir alterar estado para "Assistido"', async () => {
    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Assistido" });

    expect(res.status).toBe(200);
    expect(res.body.filme.estado).toBe("Assistido");
  });

  it("Deve permitir avaliar o filme somente após assistir", async () => {
    const res = await request(app)
      .post(`/filme/${filmeId}/avaliar`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ nota: 4 });

    expect(res.status).toBe(200);
    expect(res.body.filme.estado).toBe("Avaliado");
  });

  it("Deve permitir recomendar o filme somente após avaliação", async () => {
    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Recomendado" });

    expect(res.status).toBe(200);
    expect(res.body.filme.estado).toBe("Recomendado");
  });
});
