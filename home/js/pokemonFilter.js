import { createHtmlCards } from "./pokemonCard.js";
import {
  handleError,
  addHidden,
  removeHidden,
} from "../../generalModules/utils.js";
import {
  loading,
  nextButton,
  prevButton,
  error,
  containerPokemons,
} from "./variables.js";
import { fetchPokemonData } from "../../generalModules/fetchPokemonData.js";
import { allPokemons } from "./home.js";
const uniqueTypes = new Set();

export async function filterPokemonsByName(name) {
  removeHidden([loading]);
  addHidden([nextButton, prevButton]);
  addHidden([error]);

  const filteredPokemons = allPokemons.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );

  containerPokemons.innerHTML = "";
  if (filteredPokemons.length > 0) {
    await createHtmlCards(filteredPokemons);
  } else {
    handleError();
  }
  addHidden([loading]);
}

export async function filterPokemonsByType(type) {
  const filteredPokemons = [];

  const fetchPromises = allPokemons.results.map(async (pokemon) => {
    const pokemonData = await fetchPokemonData(pokemon.name);
    if (pokemonData.types.some((typeObj) => typeObj.type.name === type)) {
      filteredPokemons.push(pokemon);
    }
  });
  addHidden([nextButton, prevButton]);
  removeHidden([loading]);
  await Promise.all(fetchPromises);
  containerPokemons.innerHTML = "";
  if (filteredPokemons.length > 0) {
    await createHtmlCards(filteredPokemons);
  } else {
    handleError();
  }
  addHidden([loading]);
}

export async function updateTypeFilter(types, selectType) {
  types.forEach((type) => {
    if (!uniqueTypes.has(type)) {
      uniqueTypes.add(type);
      const newOption = document.createElement("option");
      newOption.textContent = type;
      newOption.value = type;
      selectType.append(newOption);
    }
  });
}
