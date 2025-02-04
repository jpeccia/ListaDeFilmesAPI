import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["request", "error", "performance"],
    required: true,
  },
  metodo: String,
  url: String,
  status: Number,
  responseTime: String,
  mensagem: String,
  timestamp: { type: Date, default: Date.now },
});

const LogModel = mongoose.model("Log", logSchema);
export default LogModel;
