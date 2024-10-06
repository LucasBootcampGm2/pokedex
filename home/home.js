import { fetchPokemonData } from "../generalModules/fetchPokemonData.js"
import { getTypeColor } from "../generalModules/getColor.js"

const containerPokemons = document.querySelector(".pokemon-container")
const selectType = document.getElementById("select-type")
const inputName = document.getElementById("input-name")

const loading = document.getElementById("loading")
const error = document.getElementById("error")

const maxPerPage = 25
let actualPage = 1

const prevButton = document.getElementById("prev-page")
const nextButton = document.getElementById("next-page")
const pagination = document.querySelector(".pagination")

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
    statMeter.style.width = `50%`
    statMeter.value = stat.base_stat

    statItem.append(statMeter)
    statItem.append(stat.base_stat)
    backCard.append(statItem)
  })

  return backCard
}

async function createHtmlCards(pokemons) {
  const fragment = document.createDocumentFragment()
  const pokemonDataPromises = pokemons.map((pokemon) =>
    fetchPokemonData(pokemon.name)
  )

  const allPokemonData = await Promise.all(pokemonDataPromises)
  allPokemonData.forEach((pokemonData) => {
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
    pokeCard.append(frontCard, backCard)
    fragment.appendChild(pokeCard)
  })

  containerPokemons.appendChild(fragment)
}

function updateButtonsVisibility() {
  prevButton.classList.toggle("hidden", actualPage <= 1)
  nextButton.classList.toggle(
    "hidden",
    containerPokemons.children.length < maxPerPage
  )
}

async function makeLimitFetch(offset, maxPerPage) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${maxPerPage}&offset=${offset}`
    )
    return response.json()
  } catch (error) {
    console.error("Error", error)
    handleEror()
  }
}

async function createPokemons(page, maxPerPage) {
  try {
    containerPokemons.innerHTML = ""
    removeHidden([loading])

    const offset = (page - 1) * maxPerPage
    const data = await makeLimitFetch(offset, maxPerPage)
    const pokemons = data.results

    await createHtmlCards(pokemons)
    updateButtonsVisibility()
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err)
    handleEror()
  } finally {
    addHidden([loading])
  }
}

async function filterPokemonsByName(name) {
  removeHidden([loading])
  addHidden([nextButton, prevButton])
  addHidden([error])

  const filteredPokemons = allPokemons.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  )

  containerPokemons.innerHTML = ""
  if (filteredPokemons.length > 0) {
    await createHtmlCards(filteredPokemons)
  } else {
    handleEror()
  }
  addHidden([loading])
}

inputName.addEventListener("input", (event) => {
  if (containerPokemons.classList.contains("hidden")) {
    removeHidden([containerPokemons, pagination])
  }
  clearTimeout(debounceTimeout)
  const name = event.target.value.toLowerCase().trim()
  addHidden([error])
  debounceTimeout = setTimeout(async () => {
    if (name.length > 0) {
      await filterPokemonsByName(name)
    } else {
      actualPage = 1
      await createPokemons(actualPage, maxPerPage)
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
  containerPokemons.innerHTML = ""
  addHidden([error])

  if (selectedType === "all") {
    await createPokemons(actualPage, maxPerPage)
  } else {
    await filterPokemonsByType(selectedType)
  }
})

async function filterPokemonsByType(type) {
  const filteredPokemons = []

  const fetchPromises = allPokemons.results.map(async (pokemon) => {
    const pokemonData = await fetchPokemonData(pokemon.name)
    if (pokemonData.types.some((typeObj) => typeObj.type.name === type)) {
      filteredPokemons.push(pokemon)
    }
  })
  addHidden([nextButton, prevButton])
  removeHidden([loading])
  await Promise.all(fetchPromises)
  containerPokemons.innerHTML = ""
  if (filteredPokemons.length > 0) {
    await createHtmlCards(filteredPokemons)
  } else {
    handleEror()
  }
  addHidden([loading])
}

function addHidden(elements) {
  elements.forEach((element) => element.classList.add("hidden"))
}

function removeHidden(elements) {
  elements.forEach((element) => element.classList.remove("hidden"))
}

function handleEror() {
  addHidden([containerPokemons, pagination])
  removeHidden([error])
}

window.addEventListener("load", async () => {
  addHidden(document.querySelectorAll(".filters"))
  removeHidden([loading])

  allPokemons = await makeLimitFetch(0, 1025)
  await Promise.all(
    allPokemons.results.map(async (pokemon) => {
      const pokemonData = await fetchPokemonData(pokemon.name)
      await updateTypeFilter(
        pokemonData.types.map((typeObj) => typeObj.type.name),
        selectType
      )
    })
  )

  await createPokemons(actualPage, maxPerPage)
  removeHidden(document.querySelectorAll(".filters"))

  removeHidden([nextButton, prevButton])
  nextButton.addEventListener("click", () => {
    actualPage++
    createPokemons(actualPage, maxPerPage)
  })

  prevButton.addEventListener("click", () => {
    if (actualPage > 1) {
      actualPage--
      createPokemons(actualPage, maxPerPage)
    }
  })
  updateButtonsVisibility()
  localStorage.clear()
})
