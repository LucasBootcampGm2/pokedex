import { getTypeColor } from "../../home/generalModules/getColor.js"

async function fetchPokemonWeaknesses(pokemonData) {
  try {
    const dataWeaknesses = pokemonData.types.map(
      (typeInfo) => typeInfo.type.url
    )

    const weaknesses = new Set()

    for (const typeUrl of dataWeaknesses) {
      const response = await fetch(typeUrl)
      const typeData = await response.json()

      typeData.damage_relations.double_damage_from.forEach((weakness) => {
        weaknesses.add(weakness.name)
      })
    }

    return Array.from(weaknesses)
  } catch (error) {
    console.error("Error al obtener las debilidades del Pokémon:", error)
    return []
  }
}

export async function addHtmlTypesAndWeaknesses(pokemonData) {
  try {
    const typesArray = pokemonData.types.map((typeObj) => typeObj.type.name)
    console.log(typesArray)

    const containerTypes = document.getElementById("container-types")
    typesArray.forEach((type) => {
      let newSpan = document.createElement("span")
      newSpan.textContent = type
      newSpan.style.backgroundColor = getTypeColor(type)
      containerTypes.append(newSpan)
    })

    const weaknesses = await fetchPokemonWeaknesses(pokemonData)
    console.log(weaknesses, "jsds")
    const containerWeaknesses = document.getElementById("container-weaknesses")
    weaknesses.forEach((weakness) => {
      let newSpan = document.createElement("span")
      newSpan.textContent = weakness
      newSpan.style.backgroundColor = getTypeColor(weakness)
      containerWeaknesses.append(newSpan)
    })
  } catch (error) {
    console.log("Error", error)
  }
}
