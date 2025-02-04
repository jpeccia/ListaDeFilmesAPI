import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    metodo: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: Number, required: true },
    responseTime: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    idFilme: { type: String, default: null }, // Vinculado a filmes (se aplicável)
    mensagem: { type: String, default: '' }
});

const LogModel = mongoose.model('Log', logSchema);
export default LogModel;
