import mongoose from 'mongoose';

const FilmeSchema = new mongoose.Schema({
    id_filme: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    sinopse: String,
    ano: String,
    genero: String,
    estado: { type: String, enum: ['A assistir', 'Assistido', 'Avaliado', 'Recomendado', 'Não recomendado'], default: 'A assistir' },
    nota: { type: Number, min: 0, max: 5, default: null }, // Apenas se avaliado
    historico: [{ acao: String, timestamp: Date }]
});

export default mongoose.model('Filme', FilmeSchema);
