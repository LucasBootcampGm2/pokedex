export async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos del Pokémon:", error);
    return null;
  }
}
