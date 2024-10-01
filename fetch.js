const body = document.querySelector("body")

async function getPokemonImage(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    )
    const data = await response.json()

    const imageUrl = data.sprites.front_default
    console.log(`Imagen de ${pokemonName} obtenida: ${imageUrl}`)
    return imageUrl
  } catch (error) {
    console.error("Error al obtener la imagen del Pokémon:", error)
    return null
  }
}

async function getPokemonName(index) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    const data = await response.json()

    console.log(`Nombre del Pokémon #${index} es: ${data.name}`)
    return data.name
  } catch (error) {
    console.error("Error al obtener el nombre del Pokémon:", error)
    return null
  }
}

async function getPokemonTypes(index) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    const data = await response.json()

    const types = data.types.map((typeObject) => typeObject.type.name)
    console.log(`Tipos del Pokémon #${index}: ${types}`)
    return types
  } catch (err) {
    console.error("Error al obtener los tipos del Pokémon:", err)
    return []
  }
}

async function createPokemonCards() {
  try {
    console.log("Creando tarjetas de Pokémon...")
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const data = await response.json()
    const pokemons = data.results
    const main = document.getElementById("main")

    const containerPokemons = document.createElement("div")
    containerPokemons.classList.add("pokemon-container")

    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i]

      const pokeCard = document.createElement("div")
      pokeCard.classList.add("card")

      const pokeName = await getPokemonName(i + 1)
      const h3 = document.createElement("h3")
      h3.textContent = pokeName || "Nombre desconocido"
      pokeCard.append(h3)

      const pokeImg = await getPokemonImage(i + 1)
      const img = document.createElement("img")
      img.classList.add("card-img")
      img.src = pokeImg
      pokeCard.append(img)

      const types = await getPokemonTypes(i + 1)
      const containerTypes = document.createElement("div")
      containerTypes.classList.add("container-types")

      const containerTypesP = document.createElement("p")
      containerTypesP.textContent = "Types"

      containerTypes.append(containerTypesP)
      types.forEach((type) => {
        let newType = document.createElement("span")
        newType.textContent = type
        switch (type) {
          case "normal":
            newType.style.backgroundColor = "gray"
            break
          case "fire":
            newType.style.backgroundColor = "orange"
            break
          case "water":
            newType.style.backgroundColor = "blue"
            break
          case "grass":
            newType.style.backgroundColor = "#2c9b2c"
            break
          case "electric":
            newType.style.backgroundColor = "yellow"
            break
          case "ice":
            newType.style.backgroundColor = "lightblue"
            break
          case "fighting":
            newType.style.backgroundColor = "red"
            break
          case "poison":
            newType.style.backgroundColor = "purple"
            break
          case "ground":
            newType.style.backgroundColor = "#a55c2a"
            break
          case "flying":
            newType.style.backgroundColor = "#00bdd5"
            break
          case "psychic":
            newType.style.backgroundColor = "pink"
            break
          case "bug":
            newType.style.backgroundColor = "lightgreen"
            break
          case "rock":
            newType.style.backgroundColor = "brown"
            break
          case "dragon":
            newType.style.backgroundColor = "purple"
            break
          case "fairy":
            newType.style.backgroundColor = "#e91e63"
            break
          case "steel":
            newType.style.backgroundColor = "#397897"
            break
          case "ghost":
            newType.style.backgroundColor = "#4b2d4b"
            break
          default:
            newType.style.backgroundColor = "purple"
            break
        }

        newType.classList.add("type-badge")
        containerTypes.append(newType)
      })
      pokeCard.append(containerTypes)

      containerPokemons.append(pokeCard)
    }

    if (main) {
      main.append(containerPokemons)
      console.log("Tarjetas de Pokémon añadidas al DOM correctamente.")
    } else {
      console.error("No se encontró el elemento 'main' en el DOM.")
    }
  } catch (err) {
    console.error("Error al crear las tarjetas de los Pokémon:", err)
  }
}

createPokemonCards()
