// DOM ELEMENT CONSTANTS
const POKEMONLIST = document.getElementById("pokemon-list");
const DIALOG = document.getElementById("dialog");
const DIALOGCONTENT = document.getElementById("dialog-content");
const DIALOGHEADER = document.getElementById("dialog-header")
const DIALOGFOOTER = document.getElementById("dialog-footer")
const BODY = document.querySelector("body");
const ABOUTHEADER = document.getElementById("about-header");
const BASESTATSHEADER = document.getElementById("base-stats-header");
const GENDERHEADER = document.getElementById("gender-header");
const MOVESHEADER = document.getElementById("moves-header")
const ABOUTDATA = document.getElementById("about-data")
const BASESTATSDATA = document.getElementById("base-stats-data")
const GENDERDATA = document.getElementById("gender-data")
const MOVESDATA = document.getElementById("moves-data")
const DIALOGPOKEMONDATA = document.getElementById("dialog-pokemon-data")

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

async function openDialog(pokemonId) {
    DIALOG.showModal();
    DIALOG.classList.add("opened");
    DIALOG.focus();
    BODY.classList.add("no-scroll");

    let response = await fetch(`${BASE_URL}pokemon/${pokemonId}`);
    let responseToJson = await response.json();
    DIALOGHEADER.classList.add(`${responseToJson.types[0].type.name}-bg`)
    if (responseToJson.abilities.length > 1) {
        if (responseToJson.types.length > 1) {
            DIALOGHEADER.insertAdjacentHTML("afterbegin" , templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
            ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
            BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
            GENDERDATA.insertAdjacentHTML("beforeend", templateGenderData(responseToJson.name, responseToJson.species.name));
            MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
            DIALOGFOOTER.insertAdjacentHTML("beforeend", templateDialogFooter(pokemonId));
        } else {
            DIALOGHEADER.insertAdjacentHTML("afterbegin" , templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
            ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
            BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
            GENDERDATA.insertAdjacentHTML("beforeend", templateGenderData(responseToJson.name, responseToJson.species.name));
            MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
            DIALOGFOOTER.insertAdjacentHTML("beforeend", templateDialogFooter(pokemonId));
    
       }
    } else {
        if (responseToJson.types.length > 1) {
            DIALOGHEADER.insertAdjacentHTML("afterbegin" , templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
            ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
            BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
            GENDERDATA.insertAdjacentHTML("beforeend", templateGenderData(responseToJson.name, responseToJson.species.name));
            MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
            DIALOGFOOTER.insertAdjacentHTML("beforeend", templateDialogFooter(pokemonId));
        } else {
            DIALOGHEADER.insertAdjacentHTML("afterbegin" , templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
            ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
            BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
            GENDERDATA.insertAdjacentHTML("beforeend", templateGenderData(responseToJson.name, responseToJson.species.name));
            MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
            DIALOGFOOTER.insertAdjacentHTML("beforeend", templateDialogFooter(pokemonId));
       }
    }
}

function moveInDialog(direction, oldId) {
    DIALOGHEADER.className = "dialog-header-visible"
    DIALOGHEADER.innerHTML = "";
    ABOUTDATA.innerHTML = "";
    BASESTATSDATA.innerHTML = "";
    GENDERDATA.innerHTML = "";
    MOVESDATA.innerHTML = "";
    DIALOGFOOTER.innerHTML = "";
    let currentPokemonId = pokemonIds.findIndex((currentId => currentId === oldId))
    if (direction === "next") {
        let newId = currentPokemonId + 1
        openDialog(pokemonIds[newId]);
    } else {
        let newId = currentPokemonId - 1
        openDialog(pokemonIds[newId]);
    }
}

function activateDataHeader(activatedheader) {
    if (activatedheader === "about") {
        ABOUTHEADER.classList.add("active-data-header")
        BASESTATSHEADER.classList.remove("active-data-header");
        GENDERHEADER.classList.remove("active-data-header");
        MOVESHEADER.classList.remove("active-data-header");

        ABOUTDATA.classList.remove("dNone")
        BASESTATSDATA.classList.add("dNone")
        GENDERDATA.classList.add("dNone")
        MOVESDATA.classList.add("dNone")
    } else if (activatedheader === 'base-stats' ) {
        ABOUTHEADER.classList.remove("active-data-header");
        BASESTATSHEADER.classList.add("active-data-header")
        GENDERHEADER.classList.remove("active-data-header");
        MOVESHEADER.classList.remove("active-data-header");

        ABOUTDATA.classList.add("dNone")
        BASESTATSDATA.classList.remove("dNone")
        GENDERDATA.classList.add("dNone")
        MOVESDATA.classList.add("dNone")
    } else if (activatedheader === "gender") {
        GENDERHEADER.classList.add("active-data-header")
        ABOUTHEADER.classList.remove("active-data-header");
        BASESTATSHEADER.classList.remove("active-data-header");
        MOVESHEADER.classList.remove("active-data-header");

        ABOUTDATA.classList.add("dNone")
        BASESTATSDATA.classList.add("dNone")
        GENDERDATA.classList.remove("dNone")
        MOVESDATA.classList.add("dNone")
    } else {
        MOVESHEADER.classList.add("active-data-header")
        GENDERHEADER.classList.remove("active-data-header");
        ABOUTHEADER.classList.remove("active-data-header");
        BASESTATSHEADER.classList.remove("active-data-header");

        ABOUTDATA.classList.add("dNone")
        BASESTATSDATA.classList.add("dNone")
        GENDERDATA.classList.add("dNone")
        MOVESDATA.classList.remove("dNone")
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

function closeDialog() {
    DIALOG.close();
    DIALOG.classList.remove("opened");
    BODY.classList.remove("no-scroll");
    DIALOGHEADER.className = "dialog-header-visible";
    DIALOGHEADER.innerHTML = "";
    ABOUTDATA.innerHTML = "";
    BASESTATSDATA.innerHTML = "";
    GENDERDATA.innerHTML = "";
    MOVESDATA.innerHTML = "";
    DIALOGFOOTER.innerHTML = "";
};

/**
 * Closes the dialog when clicking outside of it
 */
DIALOG.addEventListener('click', function (event) {
    if (event.target === DIALOG) {
        closeDialog();
    }
});

/**
 * Keyboard navigation for dialog: left/right arrow
 */
DIALOG.addEventListener('keydown', function(event) {
    if (!DIALOG.open) return;
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveInDialog('left');
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveInDialog('right');
    }
});

// Initialize the application by calling generatePokemonCards
function init() {
    getDataFromSessionStorage();
}

// Initialize the application init() when the window loads
window.onload = init;