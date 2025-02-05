import request from "supertest";
import app from "../src/server.js";
import LogModel from "../src/models/logModel.js";
import mongoose from "mongoose";

describe("Registro de Logs", () => {
  beforeEach(async () => {
    // Limpa a coleção de logs antes de cada teste
    await LogModel.deleteMany({});
  });

  afterAll(async () => {
    // Fecha a conexão com o banco de dados após todos os testes
    await mongoose.connection.close();
  });

  it("Deve registrar um log ao acessar um endpoint", async () => {
    await request(app)
      .get("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    const logs = await LogModel.find();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("tipo", "request");
  });

  it("Deve registrar um log de erro ao acessar uma rota inexistente", async () => {
    await request(app)
      .get("/rota-invalida")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    const logs = await LogModel.find({ tipo: "error" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("mensagem", "Erro interno do servidor");
  });
});
