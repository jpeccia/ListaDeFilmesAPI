import { createLogger, format, transports } from 'winston';
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    metodo: String,
    url: String,
    status: Number,
    responseTime: String,
    mensagem: String,
    timestamp: Date
});

const LogModel = mongoose.model('Log', logSchema);

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

export const logRequest = async (req, res, next) => {
    const start = process.hrtime(); // Tempo inicial

    res.on('finish', async () => {
        const duration = process.hrtime(start);
        const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(2)}ms`;

        const log = {
            metodo: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime,
            mensagem: 'Requisição registrada',
            timestamp: new Date()
        };

        logger.info(log);
        await LogModel.create(log);
    });

    next();
};

export default logger;
