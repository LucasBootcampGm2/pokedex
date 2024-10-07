import { getTypeColor } from "../../home/generalModules/getColor.js"
import { fetchPokemonData } from "../../home/generalModules/fetchPokemonData.js"
export function getEvolutionNames(chain) {
  return new Promise((resolve) => {
    let evolutions = []

    evolutions.push({
      name: chain.species.name,
      url: chain.species.url,
    })

    let currentEvolution = chain.evolves_to
    while (currentEvolution.length > 0) {
      evolutions.push({
        name: currentEvolution[0].species.name,
        url: currentEvolution[0].species.url,
      })
      currentEvolution = currentEvolution[0].evolves_to
    }

    resolve(evolutions)
  })
}

export async function fetchEvolutionChain(pokemonId) {
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    )
    const speciesData = await speciesResponse.json()

    const evolutionsResponse = await fetch(speciesData.evolution_chain.url)
    const evolutionsData = await evolutionsResponse.json()

    const evolutions = await getEvolutionNames(evolutionsData.chain)

    return evolutions
  } catch (error) {
    console.error("Error al obtener la cadena evolutiva:", error)
    return null
  }
}

export async function addPokemonHtmlEvolutions(pokemonId) {
  try {
    const evolutions = await fetchEvolutionChain(pokemonId)

    const containerEvolutions = document.getElementById("container-evolutions")
    containerEvolutions.innerHTML = ""

    for (const evolution of evolutions) {
      const pokemonData = await fetchPokemonData(evolution.name)

      let evolutionDiv = document.createElement("div")
      evolutionDiv.classList.add("evolution")

      let evolutionImg = document.createElement("img")
      evolutionImg.classList.add("evolution-img")
      evolutionImg.src =
        pokemonData.sprites.other["official-artwork"].front_default
      evolutionDiv.append(evolutionImg)

      let evolutionData = document.createElement("div")
      evolutionData.classList.add("evolution-data")

      let evolutionName = document.createElement("h4")
      evolutionName.textContent = pokemonData.name

      let evolutionNumber = document.createElement("span")
      evolutionNumber.textContent = `#${pokemonData.id}`

      evolutionData.append(evolutionNumber)
      evolutionData.append(evolutionName)
      evolutionDiv.append(evolutionData)

      let evolutionTypes = document.createElement("div")
      evolutionTypes.classList.add("evolution-types")

      pokemonData.types.forEach((typeInfo) => {
        let typeSpan = document.createElement("span")
        typeSpan.textContent = typeInfo.type.name
        typeSpan.style.backgroundColor = getTypeColor(typeInfo.type.name)
        evolutionTypes.append(typeSpan)
      })

      evolutionDiv.append(evolutionTypes)

      containerEvolutions.append(evolutionDiv)
    }
  } catch (error) {
    console.error("Error al agregar evoluciones al HTML:", error)
  }
}
