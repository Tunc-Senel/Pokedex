//DOM ELEMENT CONSTANTS
const POKEMONLIST = document.getElementById('pokemon-list');

/**
 * Generates and appends Pokémon cards to the Pokémon list in the DOM.
 * Uses different templates based on whether the Pokémon has one or two types.
 */
function generatePokemonCards() {
    for (let index = 0; index < pokemon.length; index++) {
        if ("type2" in pokemon[index]) {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(pokemon[index].name, pokemon[index].id, pokemon[index].type, pokemon[index].type2));
       } else {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(pokemon[index].name, pokemon[index].id, pokemon[index].type));
       }
    }
}

// Initialize the application by calling generatePokemonCards
function init() {
    generatePokemonCards();
}

// Initialize the application init() when the window loads
window.onload = init;