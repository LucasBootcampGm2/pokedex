import { getTypeColor } from "../generalModules/getColor.js";
import { fetchPokemonData } from "../generalModules/fetchPokemonData.js";
import { fetchPokemonDescription } from "./description/description.js";
import { addPokemonHtmlDescription } from "./description/description.js";
import { addHtmlTypesAndWeaknesses } from "./weaknesses/weaknesses.js";

function prevPokemonButton(id) {
  const prevButton = document.getElementById("previous");

  prevButton.addEventListener("click", (event) => {
    if (id !== 1) {
      localStorage.setItem("pokemon", id - 1);
      location.reload();
    } else {
      event.preventDefault();
    }
  });
}

function nextPokemonButton(id) {
  const nextButton = document.getElementById("next");

  nextButton.addEventListener("click", (event) => {
    if (id < 1025) {
      localStorage.setItem("pokemon", id + 1);
      location.reload();
    } else {
      event.preventDefault();
    }
  });
}

function addPokemonTitle(id, name) {
  const pokemonTittle = document.querySelector(".pokemon-title-h2");
  pokemonTittle.textContent = name;

  const pokemonNumber = document.querySelector(".pokemon-number");
  pokemonNumber.textContent = `#${id}`;
}

function addPokemonImg(image) {
  const pokemonImg = document.querySelector(".pokemon-img");
  pokemonImg.src = image;
}

function addPokemonStats(stats) {
  const statsList = document.getElementById("stats-list");
  statsList.innerHTML = "";

  stats.forEach((stat) => {
    const li = document.createElement("li");
    li.classList.add("first");

    const statName = stat.stat.name.toUpperCase();

    const gauge = document.createElement("ul");
    gauge.classList.add("gauge");

    const baseStat = stat.base_stat;
    const filledBars = Math.floor((baseStat / 200) * 10);

    for (let i = 0; i < 10; i++) {
      const bar = document.createElement("li");
      if (i < filledBars) {
        bar.classList.add("filled");
      } else {
        bar.classList.add("empty");
      }
      gauge.appendChild(bar);
    }

    const statSpan = document.createElement("span");
    statSpan.textContent = statName;
    statSpan.classList.add("stats-span");
    li.appendChild(gauge);
    li.appendChild(statSpan);

    statsList.appendChild(li);
  });
}

function addPokemonAttributes(pokemonData, speciesData) {
  const descriptionContainer = document.querySelector(".description-container");

  const ul1 = document.querySelector(".description-ul-1");
  ul1.innerHTML = "";

  const ul2 = document.querySelector(".description-ul-2");
  ul2.innerHTML = "";

  const heightLi = document.createElement("li");
  heightLi.innerHTML = `<span class="attribute-title">Height</span><span class="attribute-value">${
    pokemonData.height / 10
  } m</span>`;
  ul1.appendChild(heightLi);

  const weightLi = document.createElement("li");
  weightLi.innerHTML = `<span class="attribute-title">Weight</span><span class="attribute-value">${
    pokemonData.weight / 10
  } kg</span>`;
  ul1.appendChild(weightLi);

  const categoryLi = document.createElement("li");
  categoryLi.innerHTML = `<span class="attribute-title">Category</span><span class="attribute-value">${
    speciesData.genera.find((g) => g.language.name === "en").genus
  }</span>`;
  ul2.appendChild(categoryLi);

  const abilitiesLi = document.createElement("li");
  const abilitiesList = pokemonData.abilities
    .map(
      (ability) =>
        `<li><span class="attribute-value">${ability.ability.name}</span></li>`
    )
    .join("");
  abilitiesLi.innerHTML = `<span class="attribute-title">Abilities</span><ul class="attribute-list">${abilitiesList}</ul>`;
  ul2.appendChild(abilitiesLi);

  descriptionContainer.append(ul1);
  descriptionContainer.append(ul2);
}

async function fetchEvolutionChain(pokemonId) {
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    );
    const speciesData = await speciesResponse.json();

    const evolutionsResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionsData = await evolutionsResponse.json();

    const evolutions = await getEvolutionNames(evolutionsData.chain);

    return evolutions;
  } catch (error) {
    console.error("Error al obtener la cadena evolutiva:", error);
    return null;
  }
}

async function getEvolutionNames(chain) {
  let evolutions = [];

  evolutions.push({
    name: chain.species.name,
    url: chain.species.url,
  });

  let currentEvolution = chain.evolves_to;
  while (currentEvolution.length > 0) {
    evolutions.push({
      name: currentEvolution[0].species.name,
      url: currentEvolution[0].species.url,
    });
    currentEvolution = currentEvolution[0].evolves_to;
  }

  return evolutions;
}

async function addPokemonHtmlEvolutions(pokemonId) {
  try {
    const evolutions = await fetchEvolutionChain(pokemonId);

    const containerEvolutions = document.getElementById("container-evolutions");
    containerEvolutions.innerHTML = "";

    for (const evolution of evolutions) {
      const pokemonData = await fetchPokemonData(evolution.name);

      let evolutionDiv = document.createElement("div");
      evolutionDiv.classList.add("evolution");

      let evolutionImg = document.createElement("img");
      evolutionImg.classList.add("evolution-img");
      evolutionImg.src =
        pokemonData.sprites.other["official-artwork"].front_default;
      evolutionDiv.append(evolutionImg);

      let evolutionData = document.createElement("div");
      evolutionData.classList.add("evolution-data");

      let evolutionName = document.createElement("h4");
      evolutionName.textContent = pokemonData.name;

      let evolutionNumber = document.createElement("span");
      evolutionNumber.textContent = `#${pokemonData.id}`;

      evolutionData.append(evolutionNumber);
      evolutionData.append(evolutionName);
      evolutionDiv.append(evolutionData);

      let evolutionTypes = document.createElement("div");
      evolutionTypes.classList.add("evolution-types");

      pokemonData.types.forEach((typeInfo) => {
        let typeSpan = document.createElement("span");
        typeSpan.textContent = typeInfo.type.name;
        typeSpan.style.backgroundColor = getTypeColor(typeInfo.type.name);
        evolutionTypes.append(typeSpan);
      });

      evolutionDiv.append(evolutionTypes);

      containerEvolutions.append(evolutionDiv);
    }
  } catch (error) {
    console.error("Error al agregar evoluciones al HTML:", error);
  }
}

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
