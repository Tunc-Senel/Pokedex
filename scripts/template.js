/**
 * Generates an HTML template for a Pokémon card.
 *
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @returns {string} The HTML template for the Pokémon card.
 */
function templatePokemonCard(name, id, type) {
return  ` 
         <li>
            <article class="pokemon-card">
                <div class="pokemon-card-header">
                <h2>${name.toUpperCase()}</h2>
                <span class="numbers">#${id}</span>
                </div>

                <img onclick="openDialog()" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}">

                <div class="pokemon-card-footer">
                <img class="pokemon-type-img" src="./assets/img/${type}.png" alt="${type}">
                </div>
            </article>
         </li>
        `
}

/**
 * Generates an HTML template for a Pokémon card with an additional type.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @param {string} type2 - The secondary type of the Pokémon.
 * @returns {string} The HTML template for the Pokémon card with an additional type.
 */
function templatePokemonCardAdditionalType(name, id, type, type2) {
return  ` 
         <li>
            <article class="pokemon-card">
                <div class="pokemon-card-header">
                <h2>${name.toUpperCase()}</h2>
                <span class="numbers">#${id}</span>
                </div>

                <img onclick="openDialog()" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}">

                <div class="pokemon-card-footer">
                    <img class="pokemon-type-img-1" src="./assets/img/${type}.png" alt="${type}">
                    <img class="pokemon-type-img-2" src="./assets/img/${type2}.png" alt="${type2}">
                </div>
            </article>
         </li>
        `
}