import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
let server;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

  server = app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
  });
}

// Exportar a instância do servidor para os testes
export { server };
export default app;
