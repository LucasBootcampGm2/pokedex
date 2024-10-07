import { fetchPokemonData } from "../../generalModules/fetchPokemonData.js";
import {
  fetchPokemonDescription,
  addPokemonHtmlDescription,
} from "../js/description.js";
import { addHtmlTypesAndWeaknesses } from "../js/weaknesses.js";
import {
  prevPokemonButton,
  nextPokemonButton,
} from "../js/prevAndNextButtons.js";
import { addPokemonHtmlEvolutions } from "../js/evolutions.js";
import {
  addPokemonAttributes,
  addPokemonStats,
  addPokemonTitle,
  addPokemonImg,
} from "../js/especificData.js";
async function addContentWithFetchData(id) {
  try {
    const pokemonData = await fetchPokemonData(id);
    const speciesData = await fetchPokemonDescription(pokemonData.name);

    addPokemonTitle(id, pokemonData.name);
    addPokemonImg(pokemonData.sprites.other["official-artwork"].front_default);
    addPokemonStats(pokemonData.stats);
    addPokemonHtmlDescription(pokemonData.name);

    addPokemonAttributes(pokemonData, speciesData);
    addHtmlTypesAndWeaknesses(pokemonData);
    await addPokemonHtmlEvolutions(id);
  } catch (error) {
    console.error("Error:", error);
  }
}

window.addEventListener("load", () => {
  const pokemonId = parseInt(localStorage.getItem("pokemon"));
  addContentWithFetchData(pokemonId);
  nextPokemonButton(pokemonId);
  prevPokemonButton(pokemonId);
});
