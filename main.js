// DOM ELEMENT CONSTANTS
const POKEMONLIST = document.getElementById('pokemon-list');

// API CONSTANTS
const BASE_URL  = "https://pokeapi.co/api/v2/"

// Arrays of Pokemon Data that will be stored in sessionStorage
let PokemonData = {
 'pokemonNames': [],
 'pokemonIDs': [],
 'pokemonTypes': [],
 'pokemonTypes2': [],
}

/**
 * Generates and appends Pokémon cards to the Pokémon list in the DOM.
 * Uses different templates based on whether the Pokémon has one or two types.
 * Fetches Pokémon data from the PokéAPI and stores relevant data in sessionStorage.
 */
async function generatePokemonCards(){
    for (let pokemonIdIndex = 0; pokemonIdIndex < pokemonIds.length; pokemonIdIndex++) {
        let response = await fetch(`${BASE_URL}pokemon/${pokemonIds[pokemonIdIndex]}`);
        let responseToJson = await response.json();
        if (responseToJson.types.length > 1) {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
            pushPokemonData(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name);
            pushAdditionalTypeData(responseToJson.types[1].type.name);
            saveDataToSessionStorage();
            saveAdditionalTypeDataToSessionStorage();

        } else {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
            pushPokemonData(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name);
            saveDataToSessionStorage();
       }
    }
}

/**
 * Displays Pokémon cards using stored data from sessionStorage.
 * If no data is found, it calls generatePokemonCards to fetch and display the data.
 */
function showPokemonCards() {
    let type2Index = 0;
    if (PokemonData.pokemonNames.length > 0) {
        for (let pokemonIdIndex = 0; pokemonIdIndex < pokemonIds.length; pokemonIdIndex++)
            if (gen1DualTypeIds.includes(PokemonData.pokemonIDs[pokemonIdIndex])) {
                POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(PokemonData.pokemonNames[pokemonIdIndex], PokemonData.pokemonIDs[pokemonIdIndex], PokemonData.pokemonTypes[pokemonIdIndex], PokemonData.pokemonTypes2[type2Index]));
                type2Index++;
            } else {
               POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(PokemonData.pokemonNames[pokemonIdIndex], PokemonData.pokemonIDs[pokemonIdIndex], PokemonData.pokemonTypes[pokemonIdIndex]));
            }

    } else {
        generatePokemonCards();
    }
    
}

/**
 * Pushes Pokémon data into the respective arrays.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The ID of the Pokémon.
 * @param {string} type - The primary type of the Pokémon.

 */
function pushPokemonData(name, id, type) {
    PokemonData.pokemonNames.push(name);
    PokemonData.pokemonIDs.push(id);
    PokemonData.pokemonTypes.push(type);
}

 /**
 * Pushes additional type data into the respective array.
 * @param {string} type2 - The secondary type of the Pokémon.
 */
function pushAdditionalTypeData(type2) {
    PokemonData.pokemonTypes2.push(type2);
}

 
// Saves Pokémon data arrays to sessionStorage.
function saveDataToSessionStorage() {
    sessionStorage.setItem("Pokemon_Names", JSON.stringify(PokemonData.pokemonNames));
    sessionStorage.setItem("Pokemon_IDs", JSON.stringify(PokemonData.pokemonIDs));
    sessionStorage.setItem("Pokemon_Types",JSON.stringify(PokemonData.pokemonTypes));
}

// Saves additional type data array to sessionStorage.
function saveAdditionalTypeDataToSessionStorage() {
    sessionStorage.setItem("Pokemon_Types2",JSON.stringify(PokemonData.pokemonTypes2));
}

//Retrieves Pokémon data from sessionStorage and populates the PokemonData object and calls showPokemonCards.
function getDataFromSessionStorage() {
    let storagedpokemonNames = JSON.parse(sessionStorage.getItem("Pokemon_Names"));
    let storagedpokemonIDs = JSON.parse(sessionStorage.getItem("Pokemon_IDs"));
    let storagedpokemonTypes = JSON.parse(sessionStorage.getItem("Pokemon_Types"));
    let storagedpokemonTypes2 = JSON.parse(sessionStorage.getItem("Pokemon_Types2"));


    if (storagedpokemonNames != null) {
        PokemonData.pokemonNames = storagedpokemonNames;
        PokemonData.pokemonIDs = storagedpokemonIDs;
        PokemonData.pokemonTypes = storagedpokemonTypes;
        PokemonData.pokemonTypes2 = storagedpokemonTypes2;
    }

    showPokemonCards();
}

// Initialize the application by calling generatePokemonCards
function init() {
    getDataFromSessionStorage();
}

// Initialize the application init() when the window loads
window.onload = init;