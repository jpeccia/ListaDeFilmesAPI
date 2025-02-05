import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/server.js"; // Importa o servidor para evitar múltiplas instâncias

dotenv.config({ path: ".env.test" });

let server;

beforeAll(async () => {
  console.log("✅ Conectando ao banco de testes...");
  await mongoose.connect(process.env.MONGO_URI);
  server = app.listen(4000, () =>
    console.log("🔥 Servidor de testes rodando na porta 4000")
  );
});

afterAll(async () => {
  console.log("🗑️ Limpando banco de testes...");
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close(); // Fecha o servidor para evitar conflito de portas
  console.log("✅ Banco de testes fechado!");
});
