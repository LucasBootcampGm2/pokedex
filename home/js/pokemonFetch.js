import { handleError } from "../../generalModules/utils.js";
export async function fetchAllPokemons() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1025`
    );
    if (!response.ok) {
      throw new Error(`Error fetching Pokémon data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    handleError();
  }
}

export async function makeLimitFetch(offset, maxPerPage) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${maxPerPage}&offset=${offset}`
    );
    return response.json();
  } catch (error) {
    console.error("Error", error);
    handleError();
  }
}
