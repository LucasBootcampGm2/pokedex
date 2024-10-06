import { fetchPokemonData } from "../generalModules/fetchPokemonData.js"
import { getTypeColor } from "../generalModules/getColor.js"

const main = document.getElementById("main")
const containerPokemons = document.querySelector(".pokemon-container")
const selectType = document.getElementById("select-type")
const inputName = document.getElementById("input-name")

const loading = document.getElementById("loading")
const maxPerPage = 25
let actualPage = 1
const prevButton = document.getElementById("prev-page")
const nextButton = document.getElementById("next-page")

let allPokemons = []
const uniqueTypes = new Set()
let debounceTimeout = null

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
    statMeter.value = statValue

    backCard.append(statItem)
  })

  return backCard
}

async function createHtmlCards(pokemons) {
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < pokemons.length; i++) {
    const pokemonData = await fetchPokemonData(pokemons[i].name)

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
    fragment.appendChild(pokeCard)
  }

  containerPokemons.appendChild(fragment)
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

async function makeLimitFetch(offset, maxPerPage) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${maxPerPage}&offset=${offset}`
    )
    return response.json()
  } catch (error) {
    console.error("Error", error)
  }
}

async function createPokemons(page, maxPerPage) {
  try {
    containerPokemons.innerHTML = ""
    addHidden([nextButton, prevButton])
    const offset = (page - 1) * maxPerPage

    const data = await makeLimitFetch(offset, maxPerPage)
    const pokemons = data.results

    await createHtmlCards(pokemons)

    if (main) {
      main.append(containerPokemons)
      addHidden([loading])
      removeHidden([nextButton, prevButton])
    } else {
      console.error("No se encontró el elemento 'main' en el DOM.")
    }
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err)
  }
}

async function filterPokemonsByName(name) {
  try {
    addHidden([nextButton, prevButton])
    removeHidden([loading])

    const filteredPokemons = allPokemons.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    )

    containerPokemons.innerHTML = ""
    await createHtmlCards(filteredPokemons)

    addHidden([loading])
    removeHidden([nextButton, prevButton, main])
  } catch (error) {
    console.error("Error al filtrar los Pokémon por nombre:", error)
    addHidden([loading])
  }
}

inputName.addEventListener("change", function (event) {
  addHidden([nextButton, prevButton])

  clearTimeout(debounceTimeout)

  const name = event.target.value.toLowerCase().trim()

  debounceTimeout = setTimeout(async () => {
    if (name.length > 0) {
      try {
        await filterPokemonsByName(name)
      } catch (error) {
        console.error("Error al filtrar los Pokémon por nombre:", error)
      }
    } else {
      try {
        actualPage = 1
        addHidden([loading, nextButton, prevButton, containerPokemons])
        await createPokemons(actualPage, maxPerPage)
        addHidden([loading])
        removeHidden([containerPokemons, nextButton, prevButton])
      } catch (error) {
        console.error("Error al cargar los Pokémon iniciales:", error)
      }
    }
  }, 300)
})

async function updateTypeFilter(types, selectType) {
  types.forEach((type) => {
    if (!uniqueTypes.has(type)) {
      uniqueTypes.add(type)
      const newOption = document.createElement("option")
      newOption.textContent = type
      newOption.value = type
      selectType.append(newOption)
    }
  })
}

selectType.addEventListener("change", async (event) => {
  const selectedType = event.target.value

  removeHidden([loading])
  addHidden([nextButton, prevButton])

  if (selectedType === "all") {
    await createPokemons(actualPage, maxPerPage)
    removeHidden([nextButton, prevButton])
  } else {
    await filterPokemonsByType(selectedType)
  }

  addHidden([loading])
})

async function filterPokemonsByType(type) {
  try {
    addHidden([nextButton, prevButton, main, containerPokemons])
    removeHidden([loading])

    const filteredPokemons = []

    for (const pokemon of allPokemons.results) {
      const pokemonData = await fetchPokemonData(pokemon.name)

      const hasType = pokemonData.types.some(
        (typeObj) => typeObj.type.name === type
      )

      if (hasType) {
        filteredPokemons.push(pokemon)
      }
    }

    containerPokemons.innerHTML = ""
    await createHtmlCards(filteredPokemons)

    addHidden([loading])
    removeHidden([nextButton, prevButton, containerPokemons])
  } catch (error) {
    console.error("Error al filtrar los Pokémon por tipo:", error)
    addHidden([loading])
  }
}

function addHidden(elements) {
  elements.forEach((element) => {
    element.classList.add("hidden")
  })
}
function removeHidden(elements) {
  elements.forEach((element) => {
    element.classList.remove("hidden")
  })
}

window.addEventListener("load", async () => {
  addHidden([nextButton, prevButton])
  removeHidden([loading])
  allPokemons = await makeLimitFetch(0, 1025)
  for (const pokemon of allPokemons.results) {
    const pokemonData = await fetchPokemonData(pokemon.name)
    await updateTypeFilter(
      pokemonData.types.map((typeObj) => typeObj.type.name),
      selectType
    )
  }
  removeHidden([nextButton, prevButton])
  addHidden([loading])
  await createPokemons(actualPage, maxPerPage)
  nextButton.addEventListener("click", nextButtonPageEvent)
  prevButton.addEventListener("click", previousButtonPageEvent)
  localStorage.clear()
})
