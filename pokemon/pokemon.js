import { fetchPokemonData } from "../generalModules/fetchPokemonData.js";
import { fetchPokemonDescription } from "./description/description.js";
import { addPokemonHtmlDescription } from "./description/description.js";
import { addHtmlTypesAndWeaknesses } from "./weaknesses/weaknesses.js";
import { prevPokemonButton } from "./prevAndNextButtons/prevAndNextButtons.js";
import { nextPokemonButton } from "./prevAndNextButtons/prevAndNextButtons.js";
import { addPokemonHtmlEvolutions } from "./evolutions/evolutions.js";
import { addPokemonAttributes } from "./especificData/especificData.js";
import { addPokemonImg } from "./especificData/especificData.js";
import { addPokemonStats } from "./especificData/especificData.js";
import { addPokemonTitle } from "./especificData/especificData.js";

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
