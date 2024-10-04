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

export async function addPokemonHtmlDescription(pokemonName) {
  try {
    const data = await fetchPokemonDescription(pokemonName);
    const descriptionEntries = data.flavor_text_entries.filter(
      (entry) => entry.language.name === "en"
    );

    const firstDescription = descriptionEntries[0].flavor_text;

    const pName = document.querySelector(".description");
    pName.textContent = firstDescription;
  } catch (error) {
    console.error("Error", error);
  }
}
