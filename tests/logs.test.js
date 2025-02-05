import request from "supertest";
import app from "../src/server.js";
import LogModel from "../src/models/logModel.js";

describe("Registro de Logs", () => {
  it("Deve registrar um log ao acessar um endpoint", async () => {
    await request(app)
      .get("/filme")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    // 🔹 Aguarda um tempo para que o log seja salvo no banco
    await new Promise((resolve) => setTimeout(resolve, 500));

    const logs = await LogModel.find({ tipo: "request" });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("tipo", "request");
    expect(logs[0]).toHaveProperty("metodo", "GET");
    expect(logs[0]).toHaveProperty("url", "/filme");
    expect(logs[0]).toHaveProperty("status", 200);
    expect(logs[0]).toHaveProperty("responseTime");
  });

  it("Deve registrar um log de erro ao acessar uma rota inexistente", async () => {
    await request(app)
      .get("/rota-invalida")
      .set(
        "Authorization",
        `Basic ${Buffer.from("admin:senha123").toString("base64")}`
      );

    // 🔹 Aguarda um tempo para que o log seja salvo no banco
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const logs = await LogModel.find({ tipo: "error" });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("tipo", "error");
    expect(logs[0]).toHaveProperty("mensagem", "Erro interno do servidor");
    expect(logs[0]).toHaveProperty("metodo", "GET");
    expect(logs[0]).toHaveProperty("url", "/rota-invalida");
    expect(logs[0]).toHaveProperty("status", 500);
  });
});
