import request from "supertest";
import app from "../src/server.js";

describe("Endpoints de Filmes", () => {
  let filmeId;

  // Teste para adicionar um filme
  it("deve adicionar um filme à lista de desejos (POST /filme)", async () => {
    const res = await request(app)
      .post("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      )
      .send({ titulo: "Inception" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_filme"); // Verifica se o ID foi gerado
    expect(res.body.estado).toBe("A assistir");

    // Armazena o ID para testes subsequentes
    filmeId = res.body._id;
  });

  // Teste para listar filmes (GET /filme)
  it("deve listar os filmes na lista de desejos (GET /filme)", async () => {
    const res = await request(app)
      .get("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Teste para buscar detalhes de um filme (GET /filme/:id)
  it("deve retornar os detalhes de um filme (GET /filme/:id)", async () => {
    const res = await request(app)
      .get(`/filme/${filmeId}`)
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("titulo");
    expect(res.body).toHaveProperty("estado");
  });

  // Teste para atualizar o estado do filme (PUT /filme/:id/estado)
  it('não deve permitir mudar para "Avaliado" se o filme não estiver "Assistido"', async () => {
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
});
