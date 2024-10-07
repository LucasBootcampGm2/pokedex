export async function fetchPokemonData(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for ${name}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; 
  }
}
