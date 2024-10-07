import {
  prevButton,
  nextButton,
  containerPokemons,
  pagination,
  error,
} from "./variables.js"

import { actualPage, maxPerPage } from "./home.js"

export function addHidden(elements) {
  elements.forEach((element) => element.classList.add("hidden"))
}

export function removeHidden(elements) {
  elements.forEach((element) => element.classList.remove("hidden"))
}

export function handleError() {
  addHidden([containerPokemons, pagination])
  removeHidden([error])
}

export function updateButtonsVisibility() {
  prevButton.classList.toggle("hidden", actualPage <= 1)
  nextButton.classList.toggle(
    "hidden",
    containerPokemons.children.length < maxPerPage
  )
}
