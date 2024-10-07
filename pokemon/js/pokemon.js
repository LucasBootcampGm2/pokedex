import { fetchPokemonData } from "../../generalModules/fetchPokemonData.js"
import {
  fetchPokemonDescription,
  addPokemonHtmlDescription,
} from "../js/description.js"
import { addHtmlTypesAndWeaknesses } from "../js/weaknesses.js"
import {
  prevPokemonButton,
  nextPokemonButton,
} from "../js/prevAndNextButtons.js"
import { addPokemonHtmlEvolutions } from "../js/evolutions.js"
import {
  addPokemonAttributes,
  addPokemonStats,
  addPokemonTitle,
  addPokemonImg,
} from "../js/especificData.js"
import { loading } from "../../home/js/variables.js"

const body = document.getElementById("body")
const main = document.getElementById("section-pokemon-details")
const header = document.querySelector(".header")
const notFound = document.getElementById("not-found")
async function addContentWithFetchData(id) {
  try {
    const pokemonData = await fetchPokemonData(id)
    const speciesData = await fetchPokemonDescription(pokemonData.name)

    addPokemonTitle(id, pokemonData.name)
    addPokemonImg(pokemonData.sprites.other["official-artwork"].front_default)
    addPokemonStats(pokemonData.stats)
    await addPokemonHtmlDescription(pokemonData.name)

    addPokemonAttributes(pokemonData, speciesData)
    await addHtmlTypesAndWeaknesses(pokemonData)
    await addPokemonHtmlEvolutions(id)
  } catch (error) {
    console.error("Error:", error)
    showNotFoundPage()
  }
}

function showNotFoundPage() {
  header.style.display = "none"
  main.style.display = "none"

  notFound.style.display = "flex"

  notFound.style.justifyContent = "center"
  notFound.style.alignItems = "center"
  body.classList.add("body-not-found")
}

window.addEventListener("load", async () => {
  loading.style.display = "flex"
  main.style.display = "none"
  header.style.display = "none"
  const pokemonId = parseInt(localStorage.getItem("pokemon"))
  try {
    await addContentWithFetchData(pokemonId)
    loading.style.display = "none"
    nextPokemonButton(pokemonId)
    prevPokemonButton(pokemonId)

    loading.style.display = "none"
    main.style.display = "flex"
    header.style.display = "block"
  } catch (error) {
    showNotFoundPage()
  }
})
