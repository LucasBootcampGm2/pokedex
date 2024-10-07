import { createHtmlCards } from "./pokemonCard.js";
import { makeLimitFetch } from "./pokemonFetch.js";
import {
  filterPokemonsByName,
  filterPokemonsByType,
  updateTypeFilter,
} from "./pokemonFilter.js";
import {
  addHidden,
  removeHidden,
  updateButtonsVisibility,
  handleError,
} from "../../generalModules/utils.js";

import { fetchPokemonData } from "../../generalModules/fetchPokemonData.js";
import {
  containerPokemons,
  inputName,
  selectType,
  prevButton,
  nextButton,
  pagination,
} from "./variables.js";

export let allPokemons = [];
let debounceTimeout = null;
export const maxPerPage = 25;
export let actualPage = 1;

async function createPokemons(page, maxPerPage) {
  try {
    containerPokemons.innerHTML = "";
    removeHidden([loading]);
    addHidden([nextButton, prevButton]);
    const offset = (page - 1) * maxPerPage;
    const data = await makeLimitFetch(offset, maxPerPage);
    const pokemons = data.results;

    await createHtmlCards(pokemons);
    updateButtonsVisibility();
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err);
    handleError();
  } finally {
    addHidden([loading]);
  }
}

inputName.addEventListener("input", (event) => {
  if (containerPokemons.classList.contains("hidden")) {
    removeHidden([containerPokemons, pagination]);
  }
  clearTimeout(debounceTimeout);
  const name = event.target.value.toLowerCase().trim();
  addHidden([error]);
  debounceTimeout = setTimeout(async () => {
    if (name.length > 0) {
      await filterPokemonsByName(name);
    } else {
      await createPokemons(actualPage, maxPerPage);
    }
  }, 300);
});

selectType.addEventListener("change", async (event) => {
  const selectedType = event.target.value;
  containerPokemons.innerHTML = "";
  addHidden([error]);

  if (selectedType === "all") {
    await createPokemons(actualPage, maxPerPage);
  } else {
    await filterPokemonsByType(selectedType);
  }
});

window.addEventListener("load", async () => {
  addHidden(document.querySelectorAll(".container-filters"));
  removeHidden([loading]);

  allPokemons = await makeLimitFetch(0, 1025);
  await Promise.all(
    allPokemons.results.map(async (pokemon) => {
      const pokemonData = await fetchPokemonData(pokemon.name);
      await updateTypeFilter(
        pokemonData.types.map((typeObj) => typeObj.type.name),
        selectType
      );
    })
  );

  await createPokemons(actualPage, maxPerPage);
  removeHidden(document.querySelectorAll(".container-filters"));

  removeHidden([nextButton, prevButton]);
  nextButton.addEventListener("click", () => {
    actualPage++;
    createPokemons(actualPage, maxPerPage);
  });

  prevButton.addEventListener("click", () => {
    if (actualPage > 1) {
      actualPage--;
      createPokemons(actualPage, maxPerPage);
    }
  });
  updateButtonsVisibility();
  localStorage.clear();
});
