export function addPokemonTitle(id, name) {
  const pokemonTittle = document.querySelector(".pokemon-title-h2");
  pokemonTittle.textContent = name;

  const pokemonNumber = document.querySelector(".pokemon-number");
  pokemonNumber.textContent = `#${id}`;
}

export function addPokemonImg(image) {
  const pokemonImg = document.querySelector(".pokemon-img");
  pokemonImg.src = image;
}

export function addPokemonStats(stats) {
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

export function addPokemonAttributes(pokemonData, speciesData) {
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
