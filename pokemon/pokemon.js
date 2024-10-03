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

async function addContentWithFetchData(id) {
  try {
    const pokemonData = await fetchPokemonData(id)

    addPokemonTitle(id, pokemonData.name)
    addPokemonImg(pokemonData.sprites.other["official-artwork"].front_default)
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
