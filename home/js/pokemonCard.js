import { getTypeColor } from "../generalModules/getColor.js"
import { fetchPokemonData } from "../generalModules/fetchPokemonData.js"
const containerPokemons = document.querySelector(".pokemon-container")

export function createPokemonCardFront(pokemonName, pokemonImg, types, id) {
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

export function createTypesContainer(types) {
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

export function createPokemonBackCard(stats) {
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
    statMeter.style.width = "50%"
    statMeter.value = stat.base_stat

    statItem.append(statMeter)
    statItem.append(stat.base_stat)
    backCard.append(statItem)
  })

  return backCard
}

export async function createHtmlCards(pokemons) {
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
