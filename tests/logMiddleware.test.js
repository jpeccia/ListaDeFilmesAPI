import httpMocks from "node-mocks-http";
import {
  logRequisicao,
  logPerformance,
} from "../src/middleware/logMiddleware.js";
import logger from "../src/config/logger.js";
import LogModel from "../src/models/logModel.js";

// Crie mocks para o logger e para a função de salvamento no banco
jest.mock("../src/config/logger.js");
jest.mock("../src/models/logModel.js");

describe("Middleware de Logs", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "GET",
      url: "/filme",
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar next() e registrar um log de requisição", (done) => {
    // Simula o término da resposta chamando o evento 'finish'
    res.on("finish", () => {
      // Verifica se logger.info foi chamado com um objeto contendo os dados da requisição
      expect(logger.info).toHaveBeenCalled();
      // Verifica se LogModel.create foi chamado para persistir o log
      expect(LogModel.create).toHaveBeenCalled();
      done();
    });

    // Chama o middleware
    logRequisicao(req, res, next);

    // Simula o fim da resposta
    res.statusCode = 200;
    res.emit("finish");

    expect(next).toHaveBeenCalled();
  });

  it("deve registrar desempenho com logPerformance", (done) => {
    res.on("finish", () => {
      expect(logger.info).toHaveBeenCalled();
      expect(LogModel.create).toHaveBeenCalled();
      done();
    });

    logPerformance(req, res, next);
    res.statusCode = 200;
    res.emit("finish");
    expect(next).toHaveBeenCalled();
  });
});
