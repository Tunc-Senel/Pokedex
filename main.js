// DOM ELEMENT CONSTANTS
const SEARCHPOKEMON = document.getElementById("search-pokemon-input")
const POKEMONLIST = document.getElementById("pokemon-list");
const LOADINGSPINNER = document.getElementById("loading-spinner")
const LOADINGSPINNERMOREPOKEMON = document.getElementById("loading-spinner-more-pokemon")
const LOADMOREPOKEMONBUTTON = document.getElementById("load-more-pokemon-buton")
const DIALOG = document.getElementById("dialog");
const DIALOGCONTENT = document.getElementById("dialog-content");
const DIALOGHEADER = document.getElementById("dialog-header")
const DIALOGFOOTER = document.getElementById("dialog-footer")
const BODY = document.querySelector("body");
const ABOUTHEADER = document.getElementById("about-header");
const BASESTATSHEADER = document.getElementById("base-stats-header");
const EVOLUTIONHEADER = document.getElementById("evolution-header");
const MOVESHEADER = document.getElementById("moves-header")
const ABOUTDATA = document.getElementById("about-data")
const BASESTATSDATA = document.getElementById("base-stats-data")
const EVOLUTIONDATA = document.getElementById("evolution-data")
const MOVESDATA = document.getElementById("moves-data")
const DIALOGPOKEMONDATA = document.getElementById("dialog-pokemon-data")
const DIALOGARROWLEFTBUTTON = document.getElementById("move-back-in-dialog")
const DIALOGARROWRIGHTBUTTON =  document.getElementById("move-forward-in-dialog")

// API CONSTANTS
const BASE_URL  = "https://pokeapi.co/api/v2/"

// Arrays of Pokemon Data that will be stored in sessionStorage
let pokemonData = {
 "pokemonNames": [],
 "pokemonIDs": [],
 "pokemonTypes": [],
 "pokemonTypes2": [],
}

let currentPokemonDisplayedIds = [];


let currentDialogId = 0;

let type2IndexAddedPokemonStartIndex = 13;
/**
 * Generates and appends Pokémon cards to the Pokémon list in the DOM.
 * Uses different templates based on whether the Pokémon has one or two types.
 * Fetches Pokémon data from the PokéAPI and stores relevant data in sessionStorage.
 */
async function generatePokemonCards(pokemonId = pokemonIds2){
    for (let pokemonIdIndex = 0; pokemonIdIndex < pokemonId.length; pokemonIdIndex++) {
        let response = await fetch(`${BASE_URL}pokemon/${pokemonId[pokemonIdIndex]}`);
        let responseToJson = await response.json();
        savePokemonData(responseToJson);
        hideLoadingSpinner();
    }
    if (pokemonData.pokemonIDs.length <= 30) {
        displayInitilalPokemonCards();
    } else {
        displayAdditionalPokemonCards();
        } 
}

// Helpers functions
// Hides the loading spinner element.
function hideLoadingSpinner() {
    LOADINGSPINNER.classList.add("dNone");
}

// Shows the loading spinner for more Pokémon element.
function showLoadingSpinnerMorePokemon() {
    LOADINGSPINNERMOREPOKEMON.classList.remove("dNone");
}

// Hides the loading spinner for more Pokémon element.
function hideLoadingSpinnerMorePokemon() {
    LOADINGSPINNERMOREPOKEMON.classList.add("dNone");
}

// Displays the load more button element.
function displayLoadMoreButton() {
    LOADMOREPOKEMONBUTTON.classList.remove("dNone");
}

// Hides the load more button element.
function hideLoadMoreButton() {
    LOADMOREPOKEMONBUTTON.classList.add("dNone");
}

function savePokemonData(responseToJson) {
    if (responseToJson.types.length > 1) {
        pushPokemonData(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name,);
        pushAdditionalTypeData(responseToJson.types[1].type.name);
        saveDataToSessionStorage();
        saveAdditionalTypeDataToSessionStorage();
    } else {
        pushPokemonData(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name);
        saveDataToSessionStorage();
    }
}

/**
 * Displays a Pokémon card in the Pokémon list.
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {number} pokemonIdIndex - The index of the Pokémon ID.
 * @param {string} pokemonType - The primary type of the Pokémon.
 * @param {string} pokemonType2 - The secondary type of the Pokémon (if applicable).
 */
function displayInitilalPokemonCards() {
    let type2IndexShow = 0;
    for (let pokemonIdIndex = 0; pokemonIdIndex < pokemonData.pokemonIDs.length; pokemonIdIndex++) {
        if (gen1DualTypeIds.includes(pokemonData.pokemonIDs[pokemonIdIndex])) {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex], pokemonData.pokemonTypes2[type2IndexShow]));
            type2IndexShow++;
        } else {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex]));
        }
    }
}

function displayInitilalPokemonCards2(differenceSavedToBeDisplayedPokemon) {
    let type2IndexShow = 0;
    for (let pokemonIdIndex = 0; pokemonIdIndex < pokemonData.pokemonIDs.length - differenceSavedToBeDisplayedPokemon; pokemonIdIndex++) {
        if (gen1DualTypeIds.includes(pokemonData.pokemonIDs[pokemonIdIndex])) {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex], pokemonData.pokemonTypes2[type2IndexShow]));
            type2IndexShow++;
        } else {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex]));
        }
    }
}

function displayAdditionalPokemonCards() {
    let type2IndexShow = 13;
    for (let pokemonIdIndex = 30; pokemonIdIndex < pokemonData.pokemonIDs.length; pokemonIdIndex++) {
        if (gen1DualTypeIds.includes(pokemonData.pokemonIDs[pokemonIdIndex])) {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex], pokemonData.pokemonTypes2[type2IndexShow]));
            type2IndexShow++;
        } else {
            POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(pokemonData.pokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[pokemonIdIndex], pokemonData.pokemonTypes[pokemonIdIndex]));
        }
    }
}

/**
 * Displays Pokémon cards using stored data from sessionStorage.
 * If no data is found, it calls generatePokemonCards to fetch and display the data.
 */
function showPokemonCards(pokemonId = pokemonIds2) {
    let initialDifferenceSavedToBeDisplayedPokemon = 0
    let addedDifferenceSavedToBeDisplayedPokemon  = 20
    if (pokemonData.pokemonNames.length === 0) {
        generatePokemonCards(pokemonId);
    } else if (pokemonData.pokemonNames.length === 30) {
        displayInitilalPokemonCards2(initialDifferenceSavedToBeDisplayedPokemon);
    } else {
        displayInitilalPokemonCards2(addedDifferenceSavedToBeDisplayedPokemon)
    }
    hideLoadingSpinner();
    displayLoadMoreButton();
    currentPokemonDisplayedIds = pokemonIds;
}

// Loads more Pokémon cards when the load more button is clicked.
function showMorePokemon() {
    if (pokemonData.pokemonNames.length < 31) {
        hideLoadMoreButton();
        showLoadingSpinnerMorePokemon();
        generatePokemonCards();
    } else {
        hideLoadMoreButton();
        displayAdditionalPokemonCards()
    }
    hideLoadingSpinnerMorePokemon();
    currentPokemonDisplayedIds = pokemonData.pokemonIDs;
}

/**
 * Displays a Pokémon in a dialog with two evolutions and multiple abilities.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 * @param {string} stage1 - The first evolution stage of the Pokémon.
 * @param {string} stage2 - The second evolution stage of the Pokémon.
 */
function displayPokemonInDialogWith2EvolutionsAndMultipleAbilities(responseToJson, base, stage1, stage2) {
     if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(base, stage1, stage2, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(base, stage1, stage2, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

/**
 * Displays a Pokémon in a dialog with two evolutions and one ability.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 * @param {string} stage1 - The first evolution stage of the Pokémon.
 * @param {string} stage2 - The second evolution stage of the Pokémon.
 */
function displayPokemonInDialogWith2EvolutionsAndOneAbility(responseToJson, base, stage1, stage2) {
    if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(base, stage1, stage2, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(base, stage1, stage2, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

/**
 * Displays a Pokémon in a dialog with one evolution and two abilities.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 * @param {string} stage1 - The first evolution stage of the Pokémon.
 */
function displayPokemonInDialogWithOneEvolutionAndTwoAbilities(responseToJson, base, stage1) {
    if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateOneEvolutionData(base, stage1, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateOneEvolutionData(base, stage1, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

/**
 * Displays a Pokémon in a dialog with one evolution and one ability.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 * @param {string} stage1 - The first evolution stage of the Pokémon.
 */
function displayPokemonInDialogWithOneEvolutionAndOneAbility(responseToJson, base, stage1) {
    if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateOneEvolutionData(base, stage1, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateOneEvolutionData(base, stage1, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

/**
 * Displays a Pokémon in a dialog with no evolutions and two abilities.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 */
function displayPokemonInDialogWithNoEvolutionsAndTwoAbilities(responseToJson, base) {
    if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateNoEvolutionData(base, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name, responseToJson.abilities[1].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateNoEvolutionData(base, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

/** Displays a Pokémon in a dialog with no evolutions and one ability.
 * @param {Object} responseToJson - The Pokémon data from the API response.
 * @param {string} base - The base form of the Pokémon.
 */
function displayPokemonInDialogWithOneAbility(responseToJson, base) {
    if (responseToJson.types.length > 1) {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeaderDualType(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name, responseToJson.types[1].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateNoEvolutionData(base, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    } else {
        DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(responseToJson.name, responseToJson.id, responseToJson.types[0].type.name));
        ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(responseToJson.species.name, responseToJson.height, responseToJson.weight, responseToJson.abilities[0].ability.name));
        BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(responseToJson.stats[0].stat.name, responseToJson.stats[0].base_stat, responseToJson.stats[1].stat.name, responseToJson.stats[1].base_stat, responseToJson.stats[2].stat.name, responseToJson.stats[2].base_stat, responseToJson.stats[3].stat.name, responseToJson.stats[3].base_stat, responseToJson.stats[4].stat.name, responseToJson.stats[4].base_stat, responseToJson.stats[5].stat.name, responseToJson.stats[5].base_stat));
        EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateNoEvolutionData(base, responseToJson.types[0].type.name));
        MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(responseToJson.moves[0].move.name, responseToJson.moves[1].move.name, responseToJson.moves[2].move.name, responseToJson.moves[3].move.name));
    }
}

async function openDialog(pokemonId) {
    let base = "";
    let stage1 = "";
    let stage2 = "";
    currentDialogId = pokemonId;
    DIALOG.showModal();
    DIALOG.classList.add("opened");
    DIALOG.focus();
    BODY.classList.add("no-scroll");

    let response = await fetch(`${BASE_URL}pokemon/${pokemonId}`);
    let responseToJson = await response.json();
    let responseEvo = await fetch(`${BASE_URL}pokemon-species/${pokemonId}`);
    let responseEvoToJson = await responseEvo.json();
    let responseEvoData = await fetch(responseEvoToJson.evolution_chain.url);
    let responseEvoDataToJson = await responseEvoData.json();
    
    if (gen1_twoEvolutions.includes(pokemonId)) {
        base = responseEvoDataToJson.chain.species.name
        stage1 = responseEvoDataToJson.chain.evolves_to[0].species.name
        stage2 = responseEvoDataToJson.chain.evolves_to[0].evolves_to[0].species.name

        DIALOGHEADER.classList.add(`${responseToJson.types[0].type.name}-bg`)
        if (responseToJson.abilities.length > 1) {
            displayPokemonInDialogWith2EvolutionsAndMultipleAbilities(responseToJson, base, stage1, stage2)
        } else {
            displayPokemonInDialogWith2EvolutionsAndOneAbility(responseToJson, base, stage1, stage2)
        }
    } else if (gen1_oneEvolution.includes(pokemonId)) {
        base = responseEvoDataToJson.chain.species.name
        stage1 = responseEvoDataToJson.chain.evolves_to[0].species.name

        DIALOGHEADER.classList.add(`${responseToJson.types[0].type.name}-bg`)
        if (responseToJson.abilities.length > 1) {
            displayPokemonInDialogWithOneEvolutionAndTwoAbilities(responseToJson, base, stage1)
        } else {
            displayPokemonInDialogWithOneEvolutionAndOneAbility(responseToJson, base, stage1)
        }
    } else {
        base = responseEvoDataToJson.chain.species.name;

        DIALOGHEADER.classList.add(`${responseToJson.types[0].type.name}-bg`)
        if (responseToJson.abilities.length > 1) {
            displayPokemonInDialogWithNoEvolutionsAndTwoAbilities(responseToJson, base)
        } else {
            displayPokemonInDialogWithOneAbility(responseToJson, base)
        }
    }
    
    currentPokemonDisplayedIds[0] === currentDialogId ? DIALOGARROWLEFTBUTTON.disabled = true : DIALOGARROWLEFTBUTTON.disabled = false;
    currentPokemonDisplayedIds[currentPokemonDisplayedIds.length - 1] === currentDialogId ? DIALOGARROWRIGHTBUTTON.disabled = true  : DIALOGARROWRIGHTBUTTON.disabled = false;

}

// Clears the dialog data sections.
function clearDialogData() {
    DIALOGHEADER.innerHTML = "";
    ABOUTDATA.innerHTML = "";
    BASESTATSDATA.innerHTML = "";
    EVOLUTIONDATA.innerHTML = "";
    MOVESDATA.innerHTML = "";
}

// displays the next pokemon in the dialog
function displaysNextPokemonInDialog() {
    let currentPokemonId = pokemonData.pokemonIDs.findIndex((pokemonIdsID => pokemonIdsID === currentDialogId))
    let newId = 0;
    newId = currentPokemonId + 1
    openDialog(pokemonData.pokemonIDs[newId]);
}

// displays the previous pokemon in the dialog
function displaysPreviousPokemonInDialog() {
    let currentPokemonId = pokemonData.pokemonIDs.findIndex((pokemonIdsID => pokemonIdsID === currentDialogId))
    let newId = 0;
    newId = currentPokemonId - 1
    openDialog(pokemonData.pokemonIDs[newId]);
}



/* 
 * Moves in the dialog either to the next or previous pokemon based on the direction parameter.
 * @param {string} direction - The direction to move in the dialog ("next" or "previous").
 */
function moveInDialog(direction) {
    DIALOGHEADER.className = "dialog-header-visible"
    clearDialogData();
    if (direction === "next") {
        displaysNextPokemonInDialog();
    } else if (direction === "previous") {
        displaysPreviousPokemonInDialog();
    }
}

// Displays the About section in the dialog.
function displayAbout() {
    ABOUTHEADER.classList.add("active-data-header")
    BASESTATSHEADER.classList.remove("active-data-header");
    EVOLUTIONHEADER.classList.remove("active-data-header");
    MOVESHEADER.classList.remove("active-data-header");

    ABOUTDATA.classList.remove("dNone")
    BASESTATSDATA.classList.add("dNone")
    EVOLUTIONDATA.classList.add("dNone")
    MOVESDATA.classList.add("dNone")
}

// Displays the Base Stats section in the dialog.
function displayBaseStats() {
    ABOUTHEADER.classList.remove("active-data-header");
    BASESTATSHEADER.classList.add("active-data-header")
    EVOLUTIONHEADER.classList.remove("active-data-header");
    MOVESHEADER.classList.remove("active-data-header");

    ABOUTDATA.classList.add("dNone")
    BASESTATSDATA.classList.remove("dNone")
    EVOLUTIONDATA.classList.add("dNone")
    MOVESDATA.classList.add("dNone")
}

// Displays the Evolution section in the dialog.
function displayEvolution() {
    EVOLUTIONHEADER.classList.add("active-data-header")
    ABOUTHEADER.classList.remove("active-data-header");
    BASESTATSHEADER.classList.remove("active-data-header");
    MOVESHEADER.classList.remove("active-data-header");

    ABOUTDATA.classList.add("dNone")
    BASESTATSDATA.classList.add("dNone")
    EVOLUTIONDATA.classList.remove("dNone")
    MOVESDATA.classList.add("dNone")
}

// Displays the Moves section in the dialog.
function displayMoves() {
    MOVESHEADER.classList.add("active-data-header")
    EVOLUTIONHEADER.classList.remove("active-data-header");
    ABOUTHEADER.classList.remove("active-data-header");
    BASESTATSHEADER.classList.remove("active-data-header");

    ABOUTDATA.classList.add("dNone")
    BASESTATSDATA.classList.add("dNone")
    EVOLUTIONDATA.classList.add("dNone")
    MOVESDATA.classList.remove("dNone")
}

function activateDataHeader(activatedheader) {
    if (activatedheader === "about") {
        displayAbout();
    } else if (activatedheader === 'base-stats' ) {
        displayBaseStats();
    } else if (activatedheader === "evolution") {
        displayEvolution();
    } else {
        displayMoves();
    }

}

/**
 * Pushes Pokémon data into the respective arrays.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The ID of the Pokémon.
 * @param {string} type - The primary type of the Pokémon.

 */
function pushPokemonData(name, id, type) {
    pokemonData.pokemonNames.push(name);
    pokemonData.pokemonIDs.push(id);
    pokemonData.pokemonTypes.push(type);
}

 /**
 * Pushes additional type data into the respective array.
 * @param {string} type2 - The secondary type of the Pokémon.
 */
function pushAdditionalTypeData(type2) {
    pokemonData.pokemonTypes2.push(type2);
}

 
// Saves Pokémon data arrays to sessionStorage.
function saveDataToSessionStorage() {
    sessionStorage.setItem("Pokemon_Names", JSON.stringify(pokemonData.pokemonNames));
    sessionStorage.setItem("Pokemon_IDs", JSON.stringify(pokemonData.pokemonIDs));
    sessionStorage.setItem("Pokemon_Types",JSON.stringify(pokemonData.pokemonTypes));
}

// Saves additional type data array to sessionStorage.
function saveAdditionalTypeDataToSessionStorage() {
    sessionStorage.setItem("Pokemon_Types2",JSON.stringify(pokemonData.pokemonTypes2));
}

// Retrieves Pokémon data from sessionStorage and populates the respective arrays.
function getDataFromSessionStorage() {
    let storagedpokemonNames = JSON.parse(sessionStorage.getItem("Pokemon_Names"));
    let storagedpokemonIDs = JSON.parse(sessionStorage.getItem("Pokemon_IDs"));
    let storagedpokemonTypes = JSON.parse(sessionStorage.getItem("Pokemon_Types"));
    let storagedpokemonTypes2 = JSON.parse(sessionStorage.getItem("Pokemon_Types2"));

    if (storagedpokemonNames != null) {
        pokemonData.pokemonNames = storagedpokemonNames;
        pokemonData.pokemonIDs = storagedpokemonIDs;
        pokemonData.pokemonTypes = storagedpokemonTypes;
        pokemonData.pokemonTypes2 = storagedpokemonTypes2;
    }
}

// Removes the no-scroll class from the body to enable scrolling.
function enableBodyScroll() {   
    BODY.classList.remove("no-scroll");
}

// Sets the dialog header class to visible and removes any type-specific background classes.
function resetDialogHeaderClass() {
    DIALOGHEADER.className = "dialog-header-visible";
}

// Closes the dialog and resets its state.
function closeDialog() {
    DIALOG.close();
    DIALOG.classList.remove("opened");
    enableBodyScroll();
    resetDialogHeaderClass();
    clearDialogData()
    displayAbout();
};

/**
 * Closes the dialog when clicking outside of its content area.
 * @param {MouseEvent} event - The mouse event object.
 */
DIALOG.addEventListener('click', function (event) {
    if (event.target === DIALOG) {
        closeDialog();
    }
});


/**
 * Filters and displays Pokémon based on user input in the search field.
 * Listens for input events on the search field and updates the displayed Pokémon cards accordingly.
 * Note: The search functionality activates when the input length is 3 or more characters.
 * @param {InputEvent} event - The input event object.
 */
SEARCHPOKEMON.addEventListener("input", function() {
    let indexOfCurrentlyfilteredPokemon = 0;
    let indexOfCurrentlyfilteredPokemon2 = 0;
    let indexOf2typePokemon = 0;
    let searchValue = SEARCHPOKEMON.value.toLowerCase();
    POKEMONLIST.innerHTML = "";
    if (searchValue.length >= 3) {
        let filteredPokemonNames = pokemonData.pokemonNames.filter(name => name && name.includes(searchValue));
        for (let pokemonIdIndex = 0; pokemonIdIndex < filteredPokemonNames.length; pokemonIdIndex++) {
            indexOfCurrentlyfilteredPokemon = pokemonData.pokemonNames.findIndex(name => name == filteredPokemonNames[pokemonIdIndex]);
            if (gen1DualTypeIds.includes(pokemonData.pokemonIDs[indexOfCurrentlyfilteredPokemon])) {
                indexOf2typePokemon = gen1DualTypeIds.findIndex(type2 => type2 == pokemonData.pokemonIDs[indexOfCurrentlyfilteredPokemon]);
                POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(filteredPokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[indexOfCurrentlyfilteredPokemon], pokemonData.pokemonTypes[indexOfCurrentlyfilteredPokemon], pokemonData.pokemonTypes2[indexOf2typePokemon]));
            } else {
                indexOfCurrentlyfilteredPokemon2 = pokemonData.pokemonNames.findIndex(name => name == filteredPokemonNames[pokemonIdIndex]);
                POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(filteredPokemonNames[pokemonIdIndex], pokemonData.pokemonIDs[indexOfCurrentlyfilteredPokemon], pokemonData.pokemonTypes[indexOfCurrentlyfilteredPokemon2]));
            }
            LOADMOREPOKEMONBUTTON.classList.add("dNone");
        }
    } else if (searchValue.length < 3) {
        let type2IndexShow = 0;
        for (let currentPokemonDisplayedIndex = 0; currentPokemonDisplayedIndex < currentPokemonDisplayedIds.length; currentPokemonDisplayedIndex++) {
            if (gen1DualTypeIds.includes(pokemonData.pokemonIDs[currentPokemonDisplayedIndex])) {
                POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCardAdditionalType(pokemonData.pokemonNames[currentPokemonDisplayedIndex], pokemonData.pokemonIDs[currentPokemonDisplayedIndex], pokemonData.pokemonTypes[currentPokemonDisplayedIndex], pokemonData.pokemonTypes2[type2IndexShow]));
                type2IndexShow++;
            } else {
                POKEMONLIST.insertAdjacentHTML("beforeend", templatePokemonCard(pokemonData.pokemonNames[currentPokemonDisplayedIndex], pokemonData.pokemonIDs[currentPokemonDisplayedIndex], pokemonData.pokemonTypes[currentPokemonDisplayedIndex]));
            }
        }
        if (currentPokemonDisplayedIds.length > 30) {
            LOADMOREPOKEMONBUTTON.classList.add("dNone");

        } else {
            LOADMOREPOKEMONBUTTON.classList.remove("dNone")
        }
    }
});

/**
 * Handles keyboard navigation within the dialog.
 * Allows navigation to the previous or next Pokémon using the left and right arrow keys.
 * Disables navigation if at the beginning or end of the displayed Pokémon list.
 * @param {KeyboardEvent} event - The keyboard event object.
 * 
 */
DIALOG.addEventListener('keydown', function(event) {
    if (!DIALOG.open) return;
    if (event.key === 'ArrowLeft') {
        currentPokemonDisplayedIds[0] === currentDialogId ? "" :  moveInDialog('previous');
    } else if (event.key === 'ArrowRight') {
        currentPokemonDisplayedIds[currentPokemonDisplayedIds.length - 1] === currentDialogId ? "" : moveInDialog('next');
    }
});

// Initialize the application by calling generatePokemonCards
function init() {
    getDataFromSessionStorage();
    showPokemonCards(pokemonIds)
}

// Initialize the application init() when the window loads
window.onload = init;