import request from "supertest";
import app from "../src/server.js";

describe("Testes de Validação de Estados do Filme", () => {
  let filmeId;

  beforeAll(async () => {
    console.log("✅ Criando um filme para os testes...");

    const res = await request(app)
      .post("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ titulo: "Inception" });

    console.log("🔍 Resposta da API ao criar filme:", res.body);

    filmeId = res.body._id;
    console.log("✅ Filme criado com ID:", filmeId);

    const checkFilme = await request(app)
      .get(`/filme/${filmeId}`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    console.log("🔍 Verificando se o filme existe no banco:", checkFilme.body);

    if (checkFilme.status !== 200) {
      throw new Error(
        `❌ Filme não encontrado no banco! Status: ${checkFilme.status}`
      );
    }
  });

  it("Não deve permitir avaliar um filme antes de assisti-lo", async () => {
    console.log("🔍 Testando atualização de estado para 'Avaliado'...");

    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Avaliado" });

    console.log("🔍 Resposta da API:", res.body);

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBe(
      "O filme deve ser assistido antes de ser avaliado."
    );
  });

  it("Não deve permitir recomendar um filme antes de ser avaliado", async () => {
    console.log("🔍 Testando atualização de estado para 'Recomendado'...");

    const res = await request(app)
      .put(`/filme/${filmeId}/estado`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ estado: "Recomendado" });

    console.log("🔍 Resposta da API:", res.body);

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBe(
      "O filme deve ser avaliado antes de ser recomendado."
    );
  });
});
