async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener los datos del Pokémon:", error)
    return null
  }
}

function prevPokemonButton(id) {
  const prevButton = document.getElementById("previous")

  prevButton.addEventListener("click", (event) => {
    if (id !== 1) {
      localStorage.setItem("pokemon", id - 1)
      location.reload()
    } else {
      event.preventDefault()
    }
  })
}

function nextPokemonButton(id) {
  const nextButton = document.getElementById("next")

  nextButton.addEventListener("click", (event) => {
    if (id < 1025) {
      localStorage.setItem("pokemon", id + 1)
      location.reload()
    } else {
      event.preventDefault()
    }
  })
}

function addPokemonTitle(id, name) {
  const pokemonTittle = document.querySelector(".pokemon-title-h2")
  pokemonTittle.textContent = name

  const pokemonNumber = document.querySelector(".pokemon-number")
  pokemonNumber.textContent = `#${id}`
}

function addPokemonImg(image) {
  const pokemonImg = document.querySelector(".pokemon-img")
  pokemonImg.src = image
}

function addPokemonStats(stats) {
  const statsList = document.getElementById("stats-list")
  statsList.innerHTML = ""

  stats.forEach((stat) => {
    const li = document.createElement("li")
    li.classList.add("first")

    const statName = stat.stat.name.toUpperCase()

    const gauge = document.createElement("ul")
    gauge.classList.add("gauge")

    const baseStat = stat.base_stat
    const filledBars = Math.floor((baseStat / 200) * 10)

    for (let i = 0; i < 10; i++) {
      const bar = document.createElement("li")
      if (i < filledBars) {
        bar.classList.add("filled")
      } else {
        bar.classList.add("empty")
      }
      gauge.appendChild(bar)
    }

    const statSpan = document.createElement("span")
    statSpan.textContent = statName
    statSpan.classList.add("stats-span")
    li.appendChild(gauge)
    li.appendChild(statSpan)

    statsList.appendChild(li)
  })
}

async function fetchPokemonDescription(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching the Pokémon data", error)
  }
}

async function addPokemonHtmlDescription(pokemonName) {
  try {
    const data = await fetchPokemonDescription(pokemonName)
    const descriptionEntries = data.flavor_text_entries.filter(
      (entry) => entry.language.name === "en"
    )

    const firstDescription = descriptionEntries[0].flavor_text

    const pName = document.querySelector(".description")
    pName.textContent = firstDescription
  } catch (error) {
    console.error("Error", error)
  }
}

function addPokemonAttributes(pokemonData, speciesData) {
  const descriptionContainer = document.querySelector(".description-container")

  const ul1 = document.querySelector(".description-ul-1")
  ul1.innerHTML = ""

  const ul2 = document.querySelector(".description-ul-2")
  ul2.innerHTML = ""

  const heightLi = document.createElement("li")
  heightLi.innerHTML = `<span class="attribute-title">Height</span><span class="attribute-value">${
    pokemonData.height / 10
  } m</span>`
  ul1.appendChild(heightLi)

  const weightLi = document.createElement("li")
  weightLi.innerHTML = `<span class="attribute-title">Weight</span><span class="attribute-value">${
    pokemonData.weight / 10
  } kg</span>`
  ul1.appendChild(weightLi)

  const genderLi = document.createElement("li")
  genderLi.innerHTML = `<span class="attribute-title">Gender</span><span class="attribute-value"><i class="icon icon_male_symbol"></i><i class="icon icon_female_symbol"></i></span>`
  ul1.appendChild(genderLi)

  const categoryLi = document.createElement("li")
  categoryLi.innerHTML = `<span class="attribute-title">Category</span><span class="attribute-value">${
    speciesData.genera.find((g) => g.language.name === "en").genus
  }</span>`
  ul2.appendChild(categoryLi)

  const abilitiesLi = document.createElement("li")
  const abilitiesList = pokemonData.abilities
    .map(
      (ability) =>
        `<li><span class="attribute-value">${ability.ability.name}</span></li>`
    )
    .join("")
  abilitiesLi.innerHTML = `<span class="attribute-title">Abilities</span><ul class="attribute-list">${abilitiesList}</ul>`
  ul2.appendChild(abilitiesLi)

  descriptionContainer.append(ul1)
  descriptionContainer.append(ul2)
}

async function addContentWithFetchData(id) {
  try {
    const pokemonData = await fetchPokemonData(id)
    const speciesData = await fetchPokemonDescription(pokemonData.name)

    addPokemonTitle(id, pokemonData.name)
    addPokemonImg(pokemonData.sprites.other["official-artwork"].front_default)
    addPokemonStats(pokemonData.stats)
    addPokemonHtmlDescription(pokemonData.name)

    addPokemonAttributes(pokemonData, speciesData)
  } catch (error) {
    console.error("Error:", error)
  }
}

window.addEventListener("load", () => {
  const pokemonId = parseInt(localStorage.getItem("pokemon"))
  addContentWithFetchData(pokemonId)
  nextPokemonButton(pokemonId)
  prevPokemonButton(pokemonId)
})
