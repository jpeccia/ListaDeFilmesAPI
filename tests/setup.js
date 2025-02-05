import mongoose from "mongoose";
import dotenv from "dotenv";
import { server } from "../src/server.js"; // Importa a instância do servidor corretamente

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  console.log("✅ Conectando ao banco de testes...");
  await mongoose.connect(process.env.MONGO_URI, { dbName: "testDB" });
});

afterAll(async () => {
  console.log("🗑️ Limpando banco de testes...");
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Aguarda o fechamento correto do servidor
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log("✅ Servidor de testes fechado!");
  }
});
