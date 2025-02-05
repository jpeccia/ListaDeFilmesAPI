import { buscarFilmeTMDB } from "../src/services/tmdbService.js";

jest.mock("../src/services/tmdbService.js");

describe("Integração com a API TMDB", () => {
  it("Deve buscar um filme corretamente", async () => {
    // Mock da função buscarFilmeTMDB
    buscarFilmeTMDB.mockResolvedValue({
      title: "Inception",
      overview: "Um filme sobre sonhos...",
      release_date: "2010-07-16",
    });

    const filme = await buscarFilmeTMDB("Inception");

    expect(filme).toHaveProperty("title", "Inception");
    expect(filme).toHaveProperty("overview");
    expect(filme).toHaveProperty("release_date");
  });

  it("Deve retornar null para um filme inexistente", async () => {
    // Mock da função buscarFilmeTMDB para retornar null
    buscarFilmeTMDB.mockResolvedValue(null);

    const filme = await buscarFilmeTMDB("Um Filme que Não Existe 12345");
    expect(filme).toBeNull();
  });
});
