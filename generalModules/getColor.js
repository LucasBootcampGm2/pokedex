export function getTypeColor(type) {
  const typeColors = {
    normal: "#a4acaf",
    fire: "#fd7d24",
    water: "#4592c4",
    grass: "#9bcc50",
    electric: "#eed535",
    ice: "lightblue",
    fighting: "red",
    poison: "#b97fc9",
    ground: "#a55c2a",
    flying: "#3dc7ef",
    psychic: "#f366b9",
    bug: "#729f3f",
    rock: "brown",
    dragon: "purple",
    fairy: "#fdb9e9",
    steel: "#397897",
    ghost: "#4b2d4b",
  };
  return typeColors[type];
}

