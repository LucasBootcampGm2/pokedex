const main = document.getElementById("main")
const containerPokemons = document.querySelector(".pokemon-container")
const selectType = document.getElementById("select-type")
const loading = document.getElementById("loading")
const maxPerPage = 25
let actualPage = 1
const prevButton = document.getElementById("prev-page")
const nextButton = document.getElementById("next-page")

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
  h3.textContent = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
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

export function getTypeColor(type) {
  const typeColors = {
    normal: "#a4acaf",
    fire: "#fd7d24",
    water: "#4592c4",
    grass: "#9bcc50",
    electric: "#eed535",
    ice: "lightblue",
    fighting: "red",
    poison: "#b97fc9",
    ground: "#a55c2a",
    flying: "#3dc7ef",
    psychic: "#f366b9",
    bug: "#729f3f",
    rock: "brown",
    dragon: "purple",
    fairy: "#fdb9e9",
    steel: "#397897",
    ghost: "#4b2d4b",
  }
  return typeColors[type]
}

function createPokemonBackCard(stats) {
  const backCard = document.createElement("div")
  backCard.classList.add("back-card")

  const statsTitle = document.createElement("p")
  statsTitle.textContent = "Stats"
  backCard.append(statsTitle)

  stats.forEach((stat) => {
    const statItem = document.createElement("div")
    statItem.classList.add("stats-items")

    const statName = document.createElement("span")
    statName.textContent =
      stat.stat.name === "special-attack"
        ? "sp. attack"
        : stat.stat.name === "special-defense"
        ? "sp. defense"
        : stat.stat.name

    statItem.append(statName)
    statName.style.width = "90px"
    statName.style.textAlign = "left"

    const statMeter = document.createElement("meter")
    const statValue = stat.base_stat
    statItem.append(statMeter)
    statItem.append(statValue)
    statMeter.style.width = `50%`

    backCard.append(statItem)
  })

  return backCard
}

async function createHtmlCards(offset, pokemons, differentTypes) {
  try {
    for (let i = 0; i < pokemons.length; i++) {
      const pokemonData = await fetchPokemonData(i + 1 + offset)

      const pokeCard = document.createElement("a")
      pokeCard.href = "../pokemon/pokemon.html"
      pokeCard.addEventListener("click", () => {
        localStorage.setItem("pokemon", pokemonData.id)
        window.location.href = pokeCard.href
      })
      pokeCard.classList.add("card")

      const frontCard = createPokemonCardFront(
        pokemonData.name,
        pokemonData.sprites.other["official-artwork"].front_default,
        pokemonData.types.map((typeObj) => typeObj.type.name),
        pokemonData.id
      )

      const backCard = createPokemonBackCard(pokemonData.stats)

      pokeCard.append(frontCard)
      pokeCard.append(backCard)
      containerPokemons.append(pokeCard)

      updateTypeFilter(
        pokemonData.types.map((typeObj) => typeObj.type.name),
        differentTypes,
        selectType
      )
    }
  } catch (error) {
    console.error("Error al crear las tarjetas de los Pokémon:", error)
  }
}

function nextButtonPageEvent() {
  actualPage++
  containerPokemons.innerHTML = ""
  createPokemons(actualPage, maxPerPage)
}

function previousButtonPageEvent() {
  if (actualPage > 1) {
    actualPage--
    containerPokemons.innerHTML = ""
    createPokemons(actualPage, maxPerPage)
  }
}

async function createPokemons(page, maxPerPage) {
  try {
    const differentTypes = []
    const offset = (page - 1) * maxPerPage
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${maxPerPage}&offset=${offset}`
    )
    const data = await response.json()
    const pokemons = data.results

    await createHtmlCards(offset, pokemons, differentTypes)

    if (main) {
      main.append(containerPokemons)
      console.log("Tarjetas de Pokémon añadidas al DOM correctamente.")
      loading.classList.add("hidden")
      document.querySelector(".pagination").classList.remove("hidden")
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

function filterPokemons(type = "", name = "") {
  const allCards = document.querySelectorAll(".card")

  allCards.forEach((card) => {
    const types = Array.from(
      card.querySelectorAll(".container-types .type-badge")
    ).map((el) => el.textContent.toLowerCase())
    const h3 = card.querySelector(".card-h3").textContent.toLowerCase()

    const matchesType = type ? types.includes(type.toLowerCase()) : true
    const matchesName = name ? h3.includes(name.toLowerCase()) : true

    card.style.display = matchesType && matchesName ? "block" : "none"
  })
}

document.getElementById("select-type").addEventListener("change", (event) => {
  const selectedType = event.target.value
  const nameInput = document.getElementById("input-name").value
  filterPokemons(selectedType, nameInput)
})

document
  .getElementById("input-name")
  .addEventListener("input", function (event) {
    const name = event.target.value
    const selectedType = selectType.value
    filterPokemons(selectedType, name)
  })

window.addEventListener("load", () => {
  createPokemons(actualPage, maxPerPage)

  nextButton.addEventListener("click", nextButtonPageEvent)
  prevButton.addEventListener("click", previousButtonPageEvent)
  localStorage.clear()
})
