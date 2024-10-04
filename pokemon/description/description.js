export async function fetchPokemonDescription(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the Pokémon data", error);
  }
}
