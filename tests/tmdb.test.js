import { buscarFilmeTMDB } from "../src/services/tmdbService.js";

describe("Integração com a API TMDB", () => {
  it("Deve buscar um filme corretamente", async () => {
    const filme = await buscarFilmeTMDB("Inception");

    expect(filme).toHaveProperty("title", "Inception");
    expect(filme).toHaveProperty("overview");
    expect(filme).toHaveProperty("release_date");
  });

  it("Deve retornar null para um filme inexistente", async () => {
    const filme = await buscarFilmeTMDB("Um Filme que Não Existe 12345");
    expect(filme).toBeNull();
  });
});
