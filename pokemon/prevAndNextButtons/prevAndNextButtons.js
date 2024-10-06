export function prevPokemonButton(id) {
  const prevButton = document.getElementById("previous");

  prevButton.addEventListener("click", (event) => {
    if (id !== 1) {
      localStorage.setItem("pokemon", id - 1);
      location.reload();
    } else {
      event.preventDefault();
    }
  });
}

export function nextPokemonButton(id) {
  const nextButton = document.getElementById("next");

  nextButton.addEventListener("click", (event) => {
    if (id < 1025) {
      localStorage.setItem("pokemon", id + 1);
      location.reload();
    } else {
      event.preventDefault();
    }
  });
}
