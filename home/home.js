import { getTypeColor } from "../generalModules/getColor.js";
import { fetchPokemonData } from "../generalModules/fetchPokemonData.js";

const main = document.getElementById("main");
const containerPokemons = document.querySelector(".pokemon-container");
const selectType = document.getElementById("select-type");
const loading = document.getElementById("loading");
const maxPerPage = 25;
let actualPage = 1;
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
let allPokemons = [];

async function loadAllPokemons() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1025`
    );
    const data = await response.json();
    allPokemons = data.results;
    createPokemons(actualPage, maxPerPage);
  } catch (error) {
    console.error("Error al cargar los Pokémon:", error);
  }
}

async function createPokemons(page, maxPerPage) {
  try {
    containerPokemons.innerHTML = ''
    const offset = (page - 1) * maxPerPage;
    const pokemons = allPokemons.slice(offset, offset + maxPerPage);
    await createHtmlCards(offset, pokemons);
    updatePaginationVisibility();
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err);
  }
}

async function createHtmlCards(offset, pokemons) {
  containerPokemons.innerHTML = "";
  try {
    for (const pokemon of pokemons) {
      const pokemonData = await fetchPokemonData(pokemon.name);
      const pokeCard = createPokemonCard(pokemonData);
      containerPokemons.append(pokeCard);
      updateTypeFilter(pokemonData.types.map((typeObj) => typeObj.type.name));
    }
  } catch (error) {
    console.error("Error al crear las tarjetas de los Pokémon:", error);
  }
}

function createPokemonCard(pokemonData) {
  const pokeCard = document.createElement("a");
  pokeCard.href = "../pokemon/pokemon.html";
  pokeCard.addEventListener("click", () => {
    localStorage.setItem("pokemon", pokemonData.id);
    window.location.href = pokeCard.href;
  });
  pokeCard.classList.add("card");

  const frontCard = createPokemonCardFront(
    pokemonData.name,
    pokemonData.sprites.other["official-artwork"].front_default,
    pokemonData.types.map((typeObj) => typeObj.type.name),
    pokemonData.id
  );

  const backCard = createPokemonBackCard(pokemonData.stats);
  pokeCard.append(frontCard, backCard);

  return pokeCard;
}

function createPokemonCardFront(pokemonName, pokemonImg, types, id) {
  const frontCard = document.createElement("div");
  frontCard.classList.add("front-card");

  const img = document.createElement("img");
  img.classList.add("card-img");
  img.src = pokemonImg;
  frontCard.append(img);

  const containerInfo = document.createElement("div");
  containerInfo.classList.add("info-container");
  containerInfo.append(
    createSpan(`#${id}`),
    createHeading(pokemonName),
    createTypesContainer(types)
  );
  frontCard.append(containerInfo);

  return frontCard;
}

function createSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

function createHeading(name) {
  const h3 = document.createElement("h3");
  h3.classList.add("card-h3");
  h3.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  return h3;
}

function createTypesContainer(types) {
  const containerTypes = document.createElement("div");
  containerTypes.classList.add("container-types");

  types.forEach((type) => {
    const newType = document.createElement("span");
    newType.textContent = type;
    newType.classList.add("type-badge");
    newType.style.backgroundColor = getTypeColor(type);
    containerTypes.append(newType);
  });

  return containerTypes;
}

function createPokemonBackCard(stats) {
  const backCard = document.createElement("div");
  backCard.classList.add("back-card");

  const statsTitle = document.createElement("p");
  statsTitle.textContent = "Stats";
  backCard.append(statsTitle);

  stats.forEach((stat) => {
    const statItem = document.createElement("div");
    statItem.classList.add("stats-items");

    const statName = createSpan(formatStatName(stat.stat.name));
    statName.style.width = "90px";
    statName.style.textAlign = "left";

    const statMeter = document.createElement("meter");
    statMeter.value = stat.base_stat;
    statMeter.style.width = "50%";

    statItem.append(statName, statMeter, stat.base_stat);
    backCard.append(statItem);
  });

  return backCard;
}

function formatStatName(statName) {
  return statName === "special-attack"
    ? "sp. attack"
    : statName === "special-defense"
    ? "sp. defense"
    : statName;
}

function updateTypeFilter(type) {
  if (![...selectType.options].some((option) => option.text === type)) {
    const newOption = document.createElement("option");
    newOption.textContent = type;
    selectType.append(newOption);
  }
}

function updatePaginationVisibility() {
  if (main) {
    main.append(containerPokemons);
    loading.classList.add("hidden");
    document.querySelector(".pagination").classList.remove("hidden");
  } else {
    console.error("No se encontró el elemento 'main' en el DOM.");
  }
}

document.getElementById("input-name").addEventListener("input", (event) => {
  const name = event.target.value;
  if (name === "") {
    containerPokemons.innerHTML = ''
    createPokemons(actualPage, maxPerPage);
  } else {
    filterPokemonsByName(name);
  }
});

document.getElementById("select-type").addEventListener("change", (event) => {
  const selectedType = event.target.value;
  filterPokemonsByType(selectedType);
});

async function filterPokemonsByName(name) {
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );
  containerPokemons.innerHTML = "";
  await createHtmlCards(0, filteredPokemons);
}

async function filterPokemonsByType(type) {
  const filteredPokemons = [];
  for (const pokemon of allPokemons) {
    const pokemonData = await fetchPokemonData(pokemon.url);
    if (pokemonData.types.some((pokeType) => pokeType.type.name === type)) {
      filteredPokemons.push(pokemon);
    }
  }
  containerPokemons.innerHTML = "";
  await createHtmlCards(0, filteredPokemons);
}

function nextButtonPageEvent() {
  actualPage++;
  createPokemons(actualPage, maxPerPage);
}

function previousButtonPageEvent() {
  if (actualPage > 1) {
    actualPage--;
    createPokemons(actualPage, maxPerPage);
  }
}

window.addEventListener("load", () => {
  loadAllPokemons();
  nextButton.addEventListener("click", nextButtonPageEvent);
  prevButton.addEventListener("click", previousButtonPageEvent);
  localStorage.clear();
});
