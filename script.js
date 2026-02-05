// DOM ELEMENT CONSTANTS
const WEBSITE_LOGO = document.getElementById("website-logo");
const SEARCH_POKEMON = document.getElementById("search-pokemon-input");
const POKEMON_LIST = document.getElementById("pokemon-list");
const LOADING_SPINNER = document.getElementById("loading-spinner");
const LOADING_SPINNER_MORE_POKEMON = document.getElementById("loading-spinner-more-pokemon");
const LOAD_MORE_POKEMON_BUTTON = document.getElementById("load-more-pokemon-button");
const DIALOG = document.getElementById("dialog");
const DIALOG_CONTENT = document.getElementById("dialog-content");
const DIALOG_HEADER = document.getElementById("dialog-header");
const DIALOG_FOOTER = document.getElementById("dialog-footer");
const BODY = document.querySelector("body");
const ABOUT_HEADER = document.getElementById("about-header");
const BASE_STATS_HEADER = document.getElementById("base-stats-header");
const EVOLUTION_HEADER = document.getElementById("evolution-header");
const MOVES_HEADER = document.getElementById("moves-header");
const ABOUT_DATA = document.getElementById("about-data");
const BASE_STATS_DATA = document.getElementById("base-stats-data");
const EVOLUTION_DATA = document.getElementById("evolution-data");
const MOVES_DATA = document.getElementById("moves-data");
const DIALOG_ARROW_LEFT_BUTTON = document.getElementById("move-back-in-dialog");
const DIALOG_ARROW_RIGHT_BUTTON =  document.getElementById("move-forward-in-dialog");

// API CONSTANT
const BASE_URL  = "https://pokeapi.co/api/v2/"

// APPLICATION STATE VARIABLES
let pokemonDataUrls = [];
let pokemondata = [];
let pokemonEvolutionData = [];
let currentDialogId = 0;
let dialogOpenRequestId = 0;

// TRACKING FIRST AND LAST DISPLAYED POKEMON CARDS
const FIRST_POKEMON_CARD = 0;
let lastPokemonCard = 19;

// API FETCH INTERVAL AND OFFSET
let offset = 0;
const LIMIT = 20;

// Fetches basic Pokemon data from the API and populates the pokemonData array.
async function fetchBasicPokemonData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${LIMIT}&offset=${offset}`);
    let responseToJson = await response.json();
    for (const pokemon of responseToJson.results) {
        pokemonDataUrls.push(pokemon.url);
        let response1 = await fetch(pokemon.url);
        let responseToJson1 = await response1.json();
        pokemonDataObject(responseToJson1);
    } 
}

// Object for storing Pokemon data in a round format and pushing it to the pokemondata array.
function pokemonDataObject(pokemonId) {
    let pokemonDataRound = {
        "name": pokemonId.name,
        "id": pokemonId.id,
        "type": pokemonId.types.map(element => element.type.name),
        "species": pokemonId.name,
        "height": pokemonId.height,
        "weight": pokemonId.weight,
        "abilities": pokemonId.abilities.map(element => element.ability.name),
        "stats": pokemonId.stats.map(element => element.base_stat),
        "moves": pokemonId.moves
            .slice(0, 4)
            .map(element => element.move.name)
    }
    pokemondata.push(pokemonDataRound)
}

/**
 * Fetches Pokemon evolution data from the API and populates the PokemonEvolutionData array.
 * @param {number} pokemonId - The ID of the Pokemon to fetch evolution data for.
 */
async function fetchPokemonEvolutionData(pokemonId) {
    let response = await fetch(`${BASE_URL}pokemon-species/${pokemonId}`);
    let responseToJson = await response.json();
    let response2 =  await fetch(responseToJson.evolution_chain.url)
    let responseToJson2 = await response2.json();
    const pokemonEvolutionDataRound = {
        "id": pokemonId,
        "stages": [ responseToJson2.chain.species.name,
                    responseToJson2.chain.evolves_to.map(element => element.species.name),
                    responseToJson2.chain.evolves_to.flatMap(element1 =>
                        element1.evolves_to.map(element2 => element2.species.name)
                    )
                  ] 
        }
    pokemonEvolutionData.push(pokemonEvolutionDataRound) 
}

// Displays Pokemon cards to the application using stored data from sessionStorage or by fetching new data.
async function showPokemonCards() {
    getPokemonDataFromSession();
    if (pokemondata.length > offset) {
        showStoredInitialPokemonCards();
    } else {
       await showFetchedInitialPokemonCards();
        savePokemonDataToSession();
    }    
    displayLoadMoreButton();
    offset += LIMIT
}

// Displays initial Pokemon cards to the application from stored data.
function showStoredInitialPokemonCards() {
    hideLoadingSpinner();
    for (let index = 0; index < LIMIT; index++) {
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemondata[index].name, pokemondata[index].id, pokemondata[index].type)
        )
    }
}

// Displays initial Pokemon cards to the application from feetched data.
async function showFetchedInitialPokemonCards() {
    await fetchBasicPokemonData();
    hideLoadingSpinner();
    pokemondata.forEach(pokemon =>
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemon.name, pokemon.id, pokemon.type)
        )
    )
}

// Displays additional Pokemon cards to the application using stored data from sessionStorage or by fetching new data.
async function showMorePokemon() {
    getPokemonDataFromSession();
    showLoadingSpinner();
    if (pokemondata.length > offset) {
        showStoredMorePokemon();
    } else {
        await showFetchedMorePokemon();
        savePokemonDataToSession();
    }
    offset += LIMIT;
    lastPokemonCard += LIMIT;
    displayLoadMoreButton();
}

// Displays additional Pokemon cards to the application from stored data.
function showStoredMorePokemon() {
    hideLoadingSpinner();
    for (let AddedPokemonIndex = offset; AddedPokemonIndex < offset + LIMIT; AddedPokemonIndex++) {
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemondata[AddedPokemonIndex].name, pokemondata[AddedPokemonIndex].id, pokemondata[AddedPokemonIndex].type))
    }
}

// Displays additional Pokemon cards to the application from fetched data.
async function showFetchedMorePokemon() {
    await fetchBasicPokemonData();
    hideLoadingSpinner();
    for (let AddedPokemonIndex = pokemondata.length - LIMIT; AddedPokemonIndex < pokemondata.length; AddedPokemonIndex++) {
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemondata[AddedPokemonIndex].name, pokemondata[AddedPokemonIndex].id, pokemondata[AddedPokemonIndex].type))
    }
}

/**
 * Opens the dialog for a specific Pokemon, ensuring that only the lateest request opens the dialog to prevent overlapping content.
 * @param {number} pokemonId - The ID of the Pokemon to display in the dialog.
 */
async function openDialog(pokemonId) {
    dialogOpenRequestId++;
    const thisRequestId = dialogOpenRequestId;
    getPokemonEvolutionDataFromSession();
    let findEvolutionDataIndex = 0;
    if (pokemonEvolutionData.findIndex(
        pokemon => pokemon.id === pokemonId + 1) === -1 ) {
            await fetchPokemonEvolutionData(pokemonId + 1)
            findEvolutionDataIndex = pokemonEvolutionData.length -1;
    } else {
        findEvolutionDataIndex = pokemonEvolutionData.findIndex(
            pokemon => pokemon.id === pokemonId + 1)
    }
    if (thisRequestId !== dialogOpenRequestId) return;
    displayDialog(pokemonId, findEvolutionDataIndex);
}

// Displays the dialog for a specific Pokemon and populates it with data.
function displayDialog(pokemonId, findEvolutionDataIndex) {
    const stagesFlat = pokemonEvolutionData[findEvolutionDataIndex].stages.flat(Infinity).map(String);
    setUpDialog();
    displayLoadMoreButton();
    DIALOG_HEADER.classList.add(`${pokemondata[pokemonId].type[0]}-bg`)
    DIALOG_HEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(pokemondata[pokemonId].name, pokemondata[pokemonId].id, pokemondata[pokemonId].type));
    ABOUT_DATA.insertAdjacentHTML("beforeend", templateAboutData(pokemondata[pokemonId].name, pokemondata[pokemonId].height, pokemondata[pokemonId].weight, pokemondata[pokemonId].abilities));
    EVOLUTION_DATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(stagesFlat, pokemondata[pokemonId].type));
    BASE_STATS_DATA.insertAdjacentHTML("beforeend", templateBaseStatsData(pokemondata[pokemonId].stats));
    MOVES_DATA.insertAdjacentHTML("beforeend", templateMovesData(pokemondata[pokemonId].moves));
    currentDialogId = pokemonId;
    updateLeftDialogNavigationButton();
    updateRightDialogNavigationButton();
    savePokemonEvolutionDataToSession();
}

/**
 * Activates the appropriate data section in the dialog based on the activated header.
 * @param {string} activatedheader - The header that was activated ("about", "base-stats", "evolution", or "moves").
 */
function activateDataHeader(activatedheader) {
    if (activatedheader === "about") {
        displaySection(ABOUT_HEADER, ABOUT_DATA);
    } else if (activatedheader === 'base-stats' ) {
        displaySection(BASE_STATS_HEADER, BASE_STATS_DATA);
    } else if (activatedheader === "evolution") {
        displaySection(EVOLUTION_HEADER, EVOLUTION_DATA);
    } else if (activatedheader === "moves") {
        displaySection(MOVES_HEADER, MOVES_DATA);
    }
}

//  Closes the dialog and resets its state.
function closeDialog() {
    DIALOG.close();
    DIALOG.classList.remove("opened");
    resetDialogHeaderClass();
    clearDialogData();
    enableBodyScroll();
    displaySection(ABOUT_HEADER, ABOUT_DATA);
    hideLoadMoreButtonOnSearch();
};

/**
 * Moves in the dialog either to the next or previous pokemon based on the direction parameter.
 * @param {string} direction - The direction to move in the dialog ("next" or "previous").
 */
function moveInDialog(direction) {
    resetDialogHeaderClass();
    clearDialogData();
    if (direction === "next") {
        displaysNextPokemonInDialog(1)
    } else if (direction === "previous") {
        displaysNextPokemonInDialog(-1)
    }
}

/** Displays the next or previous Pokemon in the dialog based on the direction.
 * @param {number} direction - The direction to move in the dialog (1 for next, -1 for previous). 
 */ 
function displaysNextPokemonInDialog(direction) {
    let newId = 0;
    newId = currentDialogId + direction
    openDialog(newId);
}

// Saves Pokemon data arrays to sessionStorage.
function savePokemonDataToSession() {
    sessionStorage.setItem("Pokemon_Data", JSON.stringify(pokemondata));
    sessionStorage.setItem("Pokemon_Data_Urls", JSON.stringify(pokemonDataUrls))
}

// Retrieves Pokemon data from sessionStorage and populates the respective arrays.
function getPokemonDataFromSession() {
    let pokemon_Data = JSON.parse(sessionStorage.getItem("Pokemon_Data"));
    let pokemon_Data_Urls = JSON.parse(sessionStorage.getItem("Pokemon_Data_Urls"));
    if (pokemon_Data != null) {
        pokemondata = pokemon_Data;
        pokemonDataUrls = pokemon_Data_Urls
    }
}

// Saves Pokemon Evolution data arrays to sessionStorage.
function savePokemonEvolutionDataToSession() {
    sessionStorage.setItem("Pokemon_Evolution_Data", JSON.stringify(pokemonEvolutionData));
}

// Retrieves Pokemon Evolution data from sessionStorage and populates the respective arrays.
function getPokemonEvolutionDataFromSession() {
    let pokemon_Evolution_Data = JSON.parse(sessionStorage.getItem("Pokemon_Evolution_Data"));
    if (pokemon_Evolution_Data != null) {
        pokemonEvolutionData = pokemon_Evolution_Data;
    }
}

// ADDEVENTLISTENERS AND INIT FUNCTION
/**
 * Filters and displays Pokemon based on user input in the search field.
 * Listens for input events on the search field and updates the displayed Pokemon cards accordingly.
 * Note: The search functionality activates when the input length is 3 or more characters.
 * @param {InputEvent} event - The input event object.
 */
SEARCH_POKEMON.addEventListener("input", function() {
    let searchValue = SEARCH_POKEMON.value.toLowerCase();
    if (searchValue.length >= 3) {
        POKEMON_LIST.innerHTML = "";
        filterAndDisplayPokemon(searchValue);
    } else if (searchValue.length === 2) {
        POKEMON_LIST.innerHTML = "";
        displayBeforeSearchPokemonCards();
    }
});

/** Filters and displays Pokemon based on the search value.
 * @param {string} searchValue - The value to search for in Pokemon names.
 */
function filterAndDisplayPokemon(searchValue) {
    let filteredPokemon = pokemondata.filter(pokemon => pokemon.name && pokemon.name.includes(searchValue));
    for (let pokemonIdIndex = 0; pokemonIdIndex < filteredPokemon.length; pokemonIdIndex++) {
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(
                filteredPokemon[pokemonIdIndex].name,
                filteredPokemon[pokemonIdIndex].id,
                filteredPokemon[pokemonIdIndex].type
            )
        );
    }
    LOAD_MORE_POKEMON_BUTTON.classList.add("dNone");
}

// Displays all Pokemon cards to the state before any search was performed.
function displayBeforeSearchPokemonCards() {
    POKEMON_LIST.innerHTML = "";
    for (let index = 0; index < offset; index++) {
        POKEMON_LIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemondata[index].name, pokemondata[index].id, pokemondata[index].type)
        )
    }
    displayLoadMoreButton();
}

/**
 * Handles keyboard navigation within the dialog.
 * Allows navigation to the previous or next Pokemon using the left and right arrow keys.
 * Disables navigation if at the beginning or end of the displayed Pokemon list.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
DIALOG.addEventListener('keydown', function(event) {
    if (!DIALOG.open) return;
    if (event.key === 'ArrowLeft') {
        FIRST_POKEMON_CARD === currentDialogId ? "" :  moveInDialog('previous');
    } else if (event.key === 'ArrowRight') {
        lastPokemonCard === currentDialogId ? "" : moveInDialog('next');
    }
});

/**
 * Closes the dialog when clicking outside of its content area.
 * @param {MouseEvent} event - The mouse event object.
 */
DIALOG.addEventListener('click', function (event) {
    if (event.target === DIALOG) {              
        closeDialog();
    }
});

// Closes the dialog when the Escape key is pressed.
DIALOG.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDialog();
  }
});

// Reloads the page when the website logo is clicked.
WEBSITE_LOGO.addEventListener("click", function() {
    window.location.reload();
});

// Initialize the application by calling showPokemonCards() to display the initial set of Pokemon cards when the window loads.
function init() {
    showPokemonCards()
}

// Initialize the application init() when the window loads
window.onload = init;