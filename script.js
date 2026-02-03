// DOM ELEMENT CONSTANTS
const WEBSITELOGO = document.getElementById("website-logo");
const SEARCHPOKEMON = document.getElementById("search-pokemon-input");
const POKEMONLIST = document.getElementById("pokemon-list");
const LOADINGSPINNER = document.getElementById("loading-spinner");
const LOADINGSPINNERMOREPOKEMON = document.getElementById("loading-spinner-more-pokemon");
const LOADMOREPOKEMONBUTTON = document.getElementById("load-more-pokemon-button");
const DIALOG = document.getElementById("dialog");
const DIALOGCONTENT = document.getElementById("dialog-content");
const DIALOGHEADER = document.getElementById("dialog-header");
const DIALOGFOOTER = document.getElementById("dialog-footer");
const BODY = document.querySelector("body");
const ABOUTHEADER = document.getElementById("about-header");
const BASESTATSHEADER = document.getElementById("base-stats-header");
const EVOLUTIONHEADER = document.getElementById("evolution-header");
const MOVESHEADER = document.getElementById("moves-header");
const ABOUTDATA = document.getElementById("about-data");
const BASESTATSDATA = document.getElementById("base-stats-data");
const EVOLUTIONDATA = document.getElementById("evolution-data");
const MOVESDATA = document.getElementById("moves-data");
const DIALOGARROWLEFTBUTTON = document.getElementById("move-back-in-dialog");
const DIALOGARROWRIGHTBUTTON =  document.getElementById("move-forward-in-dialog");

// API CONSTANT
const BASE_URL  = "https://pokeapi.co/api/v2/"

// APPLICATION STATE VARIABLES
let PokemonDataUrls = [];
let PokemonData = [];
let PokemonEvolutionData = [];
let currentDialogId = 0;

// TRACKING FIRST AND LAST DISPLAYED POKEMON CARDS
const FIRSTPOKEMONCARD = 0;
let lastPokemonCard = 19;

// API FETCH INTERVAL AND OFFSET
let offset = 0;
const LIMIT = 20;

// Fetches basic Pokémon data from the API and populates the PokemonData array.
async function fetchBasicPokemonData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${LIMIT}&offset=${offset}`);
    let responseToJson = await response.json();
    responseToJson.results.forEach(pokemon => {
        PokemonDataUrls.push(pokemon.url)
    });
    for (let index = offset; index < offset + LIMIT; index++) {
        let response1 = await fetch(PokemonDataUrls[index])
        let responseToJson1 = await response1.json();
        let pokemonDataRound = {
            "name": responseToJson1.name,
            "id": responseToJson1.id,
            "type": responseToJson1.types.map(element => element.type.name),
            "species": responseToJson1.name,
            "height": responseToJson1.height,
            "weight": responseToJson1.weight,
            "abilities": responseToJson1.abilities.map(element => element.ability.name),
            "stats": responseToJson1.stats.map(element => element.base_stat),
            "moves": responseToJson1.moves
                        .slice(0, 4)
                        .map(element => element.move.name)
        }
    PokemonData.push(pokemonDataRound)
    }    
}

/**
 * Fetches Pokémon evolution data from the API and populates the PokemonEvolutionData array.
 * @param {number} pokemonId - The ID of the Pokémon to fetch evolution data for.
 */
async function fetchPokemonEvolutionData(pokemonId) {
    let response = await fetch(`${BASE_URL}pokemon-species/${pokemonId}`);
    let responseToJson = await response.json();
    let response2 =  await fetch(responseToJson.evolution_chain.url)
    let responseToJson2 = await response2.json();
    const stages = [
        responseToJson2.chain.species.name,
        responseToJson2.chain.evolves_to.map(element => element.species.name),
        responseToJson2.chain.evolves_to.flatMap(element1 =>
            element1.evolves_to.map(element2 => element2.species.name)
        )
    ];
    PokemonEvolutionData.length = 0;
    PokemonEvolutionData.push(stages) 
}

//   Displays Pokémon cards to the application using stored data from sessionStorage or by fetching new data.
async function showPokemonCards() {
    getPokemonDataFromSession();
    if (PokemonData.length > offset) {
        hideLoadingSpinner();
        for (let index = 0; index < LIMIT; index++) {
            POKEMONLIST.insertAdjacentHTML("beforeend",
             templatePokemonCard(PokemonData[index].name, PokemonData[index].id, PokemonData[index].type)
        )}
    } else {
        await fetchBasicPokemonData();
        hideLoadingSpinner();
        PokemonData.forEach(pokemon =>
         POKEMONLIST.insertAdjacentHTML("beforeend",
             templatePokemonCard(pokemon.name, pokemon.id, pokemon.type)
        )
    )
    savePokemonDataToSession()
    }    
    displayLoadMoreButton();
    offset += LIMIT
}

// Displays additional Pokémon cards to the application using stored data from sessionStorage or by fetching new data.
async function showMorePokemon() {
    getPokemonDataFromSession();
    showLoadingSpinner();
    if (PokemonData.length > offset) {
        hideLoadingSpinner();
        for (let AddedPokemonIndex = offset; AddedPokemonIndex < offset + LIMIT; AddedPokemonIndex++) {
         POKEMONLIST.insertAdjacentHTML("beforeend",
             templatePokemonCard(PokemonData[AddedPokemonIndex].name, PokemonData[AddedPokemonIndex].id, PokemonData[AddedPokemonIndex].type))
        }
    } else {
        await fetchBasicPokemonData();
        hideLoadingSpinner();
        for (let AddedPokemonIndex = offset; AddedPokemonIndex < PokemonData.length; AddedPokemonIndex++) {
         POKEMONLIST.insertAdjacentHTML("beforeend",
             templatePokemonCard(PokemonData[AddedPokemonIndex].name, PokemonData[AddedPokemonIndex].id, PokemonData[AddedPokemonIndex].type))
        }
        savePokemonDataToSession()
    }
    offset += LIMIT
    lastPokemonCard += LIMIT;
    displayLoadMoreButton();
}

/**
 * Opens the dialog for a specific Pokémon and populates it with data.
 * @param {number} pokemonId - The ID of the Pokémon to display in the dialog.
 */
async function openDialog(pokemonId) {
    await fetchPokemonEvolutionData(pokemonId + 1)
    const stagesFlat = PokemonEvolutionData.flat(Infinity).map(String);
    setUpDialog();
    displayLoadMoreButton();
    DIALOGHEADER.classList.add(`${PokemonData[pokemonId].type[0]}-bg`)
    DIALOGHEADER.insertAdjacentHTML("afterbegin", templateDialogHeader(PokemonData[pokemonId].name, PokemonData[pokemonId].id, PokemonData[pokemonId].type));
    ABOUTDATA.insertAdjacentHTML("beforeend", templateAboutData(PokemonData[pokemonId].name, PokemonData[pokemonId].height, PokemonData[pokemonId].weight, PokemonData[pokemonId].abilities));
    EVOLUTIONDATA.insertAdjacentHTML("beforeend", templateTwoEvolutionsData(stagesFlat, PokemonData[pokemonId].type));
    BASESTATSDATA.insertAdjacentHTML("beforeend", templateBaseStatsData(PokemonData[pokemonId].stats));
    MOVESDATA.insertAdjacentHTML("beforeend", templateMovesData(PokemonData[pokemonId].moves));
    currentDialogId = pokemonId;
    updateDialogNavigationButtons();
}

/**
 * Activates the appropriate data section in the dialog based on the activated header.
 * @param {string} activatedheader - The header that was activated ("about", "base-stats", "evolution", or "moves").
 */
function activateDataHeader(activatedheader) {
    if (activatedheader === "about") {
        displayAbout();
    } else if (activatedheader === 'base-stats' ) {
        displayBaseStats();
    } else if (activatedheader === "evolution") {
        displayEvolution();
    } else if (activatedheader === "moves") {
        displayMoves();
    }
}

// Displays the About section.
function displayAbout() {
    displaySection(ABOUTHEADER, ABOUTDATA);
}

// Displays the Base Stats section.
function displayBaseStats() {
    displaySection(BASESTATSHEADER, BASESTATSDATA);
}

 // Displays the Evolution section.
function displayEvolution() {
    displaySection(EVOLUTIONHEADER, EVOLUTIONDATA);
}

 // Displays the Moves section.
function displayMoves() {
    displaySection(MOVESHEADER, MOVESDATA);
}

//  Closes the dialog and resets its state.
function closeDialog() {
    DIALOG.close();
    DIALOG.classList.remove("opened");
    resetDialogHeaderClass();
    clearDialogData();
    enableBodyScroll();
    displayAbout();
};

/**
 * Moves in the dialog either to the next or previous pokemon based on the direction parameter.
 * @param {string} direction - The direction to move in the dialog ("next" or "previous").
 */
function moveInDialog(direction) {
    resetDialogHeaderClass();
    clearDialogData();
    if (direction === "next") {
        displaysNextPokemonInDialog();
    } else if (direction === "previous") {
        displaysPreviousPokemonInDialog();
    }
}

// displays the next pokemon in the dialog
function displaysNextPokemonInDialog() {
    let newId = 0;
    newId = currentDialogId + 1
    openDialog(newId);
}

// displays the previous pokemon in the dialog
function displaysPreviousPokemonInDialog() {
    let newId = 0;
    newId = currentDialogId - 1
    openDialog(newId);
}

// Saves Pokémon data arrays to sessionStorage.
function savePokemonDataToSession() {
    sessionStorage.setItem("Pokemon_Data", JSON.stringify(PokemonData));
    sessionStorage.setItem("Pokemon_Data_Urls", JSON.stringify(PokemonDataUrls))
}

// Retrieves Pokémon data from sessionStorage and populates the respective arrays.
function getPokemonDataFromSession() {
    let Pokemon_Data = JSON.parse(sessionStorage.getItem("Pokemon_Data"));
    let Pokemon_Data_Urls = JSON.parse(sessionStorage.getItem("Pokemon_Data_Urls"));
    if (Pokemon_Data != null) {
        PokemonData = Pokemon_Data;
        PokemonDataUrls = Pokemon_Data_Urls
    }
}

// ADDEVENTLISTENERS AND INIT FUNCTION
/**
 * Filters and displays Pokémon based on user input in the search field.
 * Listens for input events on the search field and updates the displayed Pokémon cards accordingly.
 * Note: The search functionality activates when the input length is 3 or more characters.
 * @param {InputEvent} event - The input event object.
 */
SEARCHPOKEMON.addEventListener("input", function() {
    let searchValue = SEARCHPOKEMON.value.toLowerCase();
    if (searchValue.length >= 3) {
        POKEMONLIST.innerHTML = "";
        filterAndDisplayPokemon(searchValue);
    } else if (searchValue.length === 0) {
        POKEMONLIST.innerHTML = "";
        displayBeforeSearchPokemonCards();
    }
});

/** Filters and displays Pokémon based on the search value.
 * @param {string} searchValue - The value to search for in Pokémon names.
 */
function filterAndDisplayPokemon(searchValue) {
    let filteredPokemon = PokemonData.filter(pokemon => pokemon.name && pokemon.name.includes(searchValue));
    for (let pokemonIdIndex = 0; pokemonIdIndex < filteredPokemon.length; pokemonIdIndex++) {
        POKEMONLIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(
                filteredPokemon[pokemonIdIndex].name,
                filteredPokemon[pokemonIdIndex].id,
                filteredPokemon[pokemonIdIndex].type
            )
        );
        LOADMOREPOKEMONBUTTON.classList.add("dNone");
    }
}

// Displays all Pokémon cards to the state before any search was performed.
function displayBeforeSearchPokemonCards() {
    POKEMONLIST.innerHTML = "";
    PokemonData.forEach(pokemon =>
        POKEMONLIST.insertAdjacentHTML("beforeend",
            templatePokemonCard(pokemon.name, pokemon.id, pokemon.type)
        )
    );
    displayLoadMoreButton();
}

// HELPER FUNCTIONS
// Sets up and opens the dialog
function setUpDialog() {
    DIALOG.showModal();
    DIALOG.classList.add("opened");
    DIALOG.focus();
    BODY.classList.add("no-scroll");
}

// Updates the state of the dialog navigation buttons.
function updateDialogNavigationButtons() {
    if (FIRSTPOKEMONCARD === currentDialogId) {
        DIALOGARROWLEFTBUTTON.disabled = true;
        DIALOGARROWLEFTBUTTON.classList.add("disable-button");
    } else {
        DIALOGARROWLEFTBUTTON.disabled = false;
        DIALOGARROWLEFTBUTTON.classList.remove("disable-button");
    }
    if (lastPokemonCard === currentDialogId) {
        DIALOGARROWRIGHTBUTTON.disabled = true;
        DIALOGARROWRIGHTBUTTON.classList.add("disable-button");
    } else {
        DIALOGARROWRIGHTBUTTON.disabled = false;
        DIALOGARROWRIGHTBUTTON.classList.remove("disable-button");
    }
}

// Resets the dialog header class to its default state.
function resetDialogHeaderClass() {
    DIALOGHEADER.className = "dialog-header-visible"
}

// Clears the dialog data sections.
function clearDialogData() {
    DIALOGHEADER.innerHTML = "";
    ABOUTDATA.innerHTML = "";
    BASESTATSDATA.innerHTML = "";
    EVOLUTIONDATA.innerHTML = "";
    MOVESDATA.innerHTML = "";
}

// Displays the About section in the dialog.
function displaySection(activeHeader) {
    const headers = [ABOUTHEADER, BASESTATSHEADER, EVOLUTIONHEADER, MOVESHEADER];
    const datas = [ABOUTDATA, BASESTATSDATA, EVOLUTIONDATA, MOVESDATA];
    headers.forEach((header, index) => {
        if (header === activeHeader) {
            header.classList.add("active-data-header");
            datas[index].classList.remove("dNone");
        } else {
            header.classList.remove("active-data-header");
            datas[index].classList.add("dNone");
        }
    });
}

// Enables body scrolling.
function enableBodyScroll() {
    BODY.classList.remove("no-scroll");
}

// Hides the loading spinner element.
function hideLoadingSpinner() {
    LOADINGSPINNER.classList.add("dNone");
    LOADINGSPINNERMOREPOKEMON.classList.add("dNone");
}

// Shows the loading spinner element for loading more Pokémon and hides the load more button.
function showLoadingSpinner() {
    LOADINGSPINNERMOREPOKEMON.classList.remove("dNone");
    LOADMOREPOKEMONBUTTON.classList.add("dNone");
}

// Displays the load more button element.
function displayLoadMoreButton() {
    LOADMOREPOKEMONBUTTON.classList.remove("dNone");
}

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
        FIRSTPOKEMONCARD === currentDialogId ? "" :  moveInDialog('previous');
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

WEBSITELOGO.addEventListener("click", function() {
    window.location.reload();
});

// Initialize the application by calling generatePokemonCards
function init() {
    showPokemonCards()
}

// Initialize the application init() when the window loads
window.onload = init;