const body = document.querySelector("body")

async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    )
    return await response.json()
  } catch (error) {
    console.error("Error al obtener los datos del Pokémon:", error)
    return null
  }
}

function createPokemonCardFront(pokemonName, pokemonImg, types, id) {
  const frontCard = document.createElement("div")
  frontCard.classList.add("front-card")

  const img = document.createElement("img")
  img.classList.add("card-img")
  img.src = pokemonImg
  frontCard.append(img)

  const containerInfo = document.createElement("div")

  const pokeNum = document.createElement("span")
  pokeNum.textContent = `#${id}`
  containerInfo.append(pokeNum)

  const h3 = document.createElement("h3")
  h3.classList.add("card-h3")
  h3.textContent = pokemonName || "Nombre desconocido"

  containerInfo.append(h3)

  const containerTypes = createTypesContainer(types)
  containerInfo.append(containerTypes)
  containerInfo.classList.add("info-container")
  frontCard.append(containerInfo)

  return frontCard
}

function createTypesContainer(types) {
  const containerTypes = document.createElement("div")
  containerTypes.classList.add("container-types")

  types.forEach((type) => {
    const newType = document.createElement("span")
    newType.textContent = type
    newType.classList.add("type-badge")
    newType.style.backgroundColor = getTypeColor(type)
    containerTypes.append(newType)
  })

  return containerTypes
}

function getTypeColor(type) {
  const typeColors = {
    normal: "gray",
    fire: "orange",
    water: "blue",
    grass: "#2c9b2c",
    electric: "yellow",
    ice: "lightblue",
    fighting: "red",
    poison: "purple",
    ground: "#a55c2a",
    flying: "#00bdd5",
    psychic: "pink",
    bug: "lightgreen",
    rock: "brown",
    dragon: "purple",
    fairy: "#e91e63",
    steel: "#397897",
    ghost: "#4b2d4b",
  }
  return typeColors[type] || "purple"
}

function createPokemonCardBack(stats) {
  const backCard = document.createElement("div")
  backCard.classList.add("back-card")

  const statsTitle = document.createElement("p")
  statsTitle.textContent = "Stats"
  backCard.append(statsTitle)

  stats.forEach((stat) => {
    const statItem = document.createElement("p")
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`
    backCard.append(statItem)
  })

  return backCard
}

async function createPokemonCards() {
  try {
    const main = document.getElementById("main")

    const containerPokemons = document.createElement("div")
    containerPokemons.classList.add("pokemon-container")

    const selectType = document.getElementById("select-type")
    const differentTypes = []

    const loading = document.getElementById("loading")

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=125")

    const data = await response.json()
    const pokemons = data.results

    for (let i = 0; i < pokemons.length; i++) {
      const pokemonData = await fetchPokemonData(i + 1)

      const pokeCard = document.createElement("div")
      pokeCard.classList.add("card")

      const frontCard = createPokemonCardFront(
        pokemonData.name,
        pokemonData.sprites.front_default,
        pokemonData.types.map((typeObj) => typeObj.type.name),
        pokemonData.id
      )

      const backCard = createPokemonCardBack(pokemonData.stats)

      pokeCard.append(frontCard)
      pokeCard.append(backCard)
      containerPokemons.append(pokeCard)

      updateTypeFilter(
        pokemonData.types.map((typeObj) => typeObj.type.name),
        differentTypes,
        selectType
      )
    }

    if (main) {
      main.append(containerPokemons)
      console.log("Tarjetas de Pokémon añadidas al DOM correctamente.")
      loading.classList.add("hidden")
    } else {
      console.error("No se encontró el elemento 'main' en el DOM.")
    }
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err)
  }
}

function updateTypeFilter(types, differentTypes, selectType) {
  types.forEach((type) => {
    if (!differentTypes.includes(type)) {
      differentTypes.push(type)
      const newOption = document.createElement("option")
      newOption.textContent = type
      selectType.append(newOption)
    }
  })
}

document.getElementById("select-type").addEventListener("change", (event) => {
  const selectedType = event.target.value
  filterPokemonsByType(selectedType)
})

function filterPokemonsByType(type) {
  const allCards = document.querySelectorAll(".card")
  allCards.forEach((card) => {
    const types = card.querySelector(".container-types")
    if (types.textContent.includes(type)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

document
  .getElementById("input-name")
  .addEventListener("input", function (event) {
    const name = event.target.value
    filterPokemonsByName(name)
  })

function filterPokemonsByName(name) {
  const allCards = document.querySelectorAll(".card")
  allCards.forEach((card) => {
    const h3 = card.querySelector(".card-h3")
    if (h3.textContent.toLowerCase().includes(name.toLowerCase())) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

createPokemonCards()
