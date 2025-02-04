import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = `https://api.themoviedb.org/3`;

export const buscarFilmeTMDB = async (titulo) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query: titulo },
    });

    if (response.data.results.length === 0) return null;
    return response.data.results[0];
  } catch (error) {
    console.error(`Erro ao buscar filme na TMDB`, error);
    return null;
  }
};
