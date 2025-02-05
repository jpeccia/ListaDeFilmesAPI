import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  console.log("✅ Conectando ao banco de testes...");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Banco de testes conectado!");
});

afterAll(async () => {
  console.log("🗑️ Limpando banco de testes...");
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("✅ Banco de testes fechado!");
});
