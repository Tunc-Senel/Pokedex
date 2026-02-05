// HELPER FUNCTIONS
// Sets up and opens the dialog
function setUpDialog() {
    DIALOG.showModal();
    DIALOG.classList.add("opened");
    DIALOG.focus();
    BODY.classList.add("no-scroll");
}

// Disables or enables the left arrow button in the dialog based on the current dialog ID.
function updateLeftDialogNavigationButton() {
    if (FIRST_POKEMON_CARD === currentDialogId) {
        DIALOG_ARROW_LEFT_BUTTON.disabled = true;
        DIALOG_ARROW_LEFT_BUTTON.classList.add("disable-button");
    } else {
        DIALOG_ARROW_LEFT_BUTTON.disabled = false;
        DIALOG_ARROW_LEFT_BUTTON.classList.remove("disable-button");
    }
}

// Disables or enables the right arrow button in the dialog based on the current dialog ID.
function updateRightDialogNavigationButton() {
    if (lastPokemonCard === currentDialogId) {
        DIALOG_ARROW_RIGHT_BUTTON.disabled = true;
        DIALOG_ARROW_RIGHT_BUTTON.classList.add("disable-button");
    } else {
        DIALOG_ARROW_RIGHT_BUTTON.disabled = false;
        DIALOG_ARROW_RIGHT_BUTTON.classList.remove("disable-button");
    }
}

// Resets the dialog header class to its default state.
function resetDialogHeaderClass() {
    DIALOG_HEADER.className = "dialog-header-visible"
}

// Clears the dialog data sections.
function clearDialogData() {
    DIALOG_HEADER.innerHTML = "";
    ABOUT_DATA.innerHTML = "";
    BASE_STATS_DATA.innerHTML = "";
    EVOLUTION_DATA.innerHTML = "";
    MOVES_DATA.innerHTML = "";
}

// Hides the Load More button if the search input length is greater than or equal to 3.
function hideLoadMoreButtonOnSearch() {
    SEARCH_POKEMON.value.length >= 3 ? LOAD_MORE_POKEMON_BUTTON.classList.add("dNone") : "";
}

// Displays the About, Base Stats, Evolution, or Moves section in the dialog based on the active header.
function displaySection(activeHeader) {
    const headers = [ABOUT_HEADER, BASE_STATS_HEADER, EVOLUTION_HEADER, MOVES_HEADER];
    const datas = [ABOUT_DATA, BASE_STATS_DATA, EVOLUTION_DATA, MOVES_DATA];
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
    LOADING_SPINNER.classList.add("dNone");
    LOADING_SPINNER_MORE_POKEMON.classList.add("dNone");
}

// Shows the loading spinner element for loading more Pokemon and hides the load more button.
function showLoadingSpinner() {
    LOADING_SPINNER_MORE_POKEMON.classList.remove("dNone");
    LOAD_MORE_POKEMON_BUTTON.classList.add("dNone");
}

// Displays the load more button element.
function displayLoadMoreButton() {
    LOAD_MORE_POKEMON_BUTTON.classList.remove("dNone");
}