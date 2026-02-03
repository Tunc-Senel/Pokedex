// Template functions for generating HTML content for Pokémon cards and dialogs.
/**
 * Generates an HTML template for a Pokémon card.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string|string[]} types - The types of the Pokémon.
 * @returns {string} The HTML template for the Pokémon card.
 */
function templatePokemonCard(name, id, types) {
   return  ` 
            <li>
               <article class="pokemon-card">
                  <div class="pokemon-card-header">
                     <h2 aria-label="Pokémon name">${name[0].toUpperCase() + name.replace("-f", "♀").replace("-m", "♂").slice(1)}</h2>
                     <span class="numbers" aria-label="Pokémon number">#${id}</span>
                  </div>
                  <img onclick="openDialog(${id - 1})" onkeydown="event.key === 'Enter' && openDialog(${id}) || event.key === ' ' && openDialog(${id})" class="pokemon-card-img ${types[0]}-bg" src="https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${name}.png" alt="${name}" tabindex="0">
                  <div class="pokemon-card-footer">
                     ${types.map((type, index) => {
                        const className =
                           types.length === 1 ? "pokemon-type-img"
                              : index === 0 ? "pokemon-type-img-1" : "pokemon-type-img-2"
                        return `<img class="${className}" src="./assets/img/${type}.png" alt="${type} type">`;
                     }).join("")}
                  </div>
               </article>
            </li>
         `
}

/**
 * Generates an HTML template for the header of a Pokémon dialog.
 * @param {string} name - The name of the Pokémon. 
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string|string[]} types - The types of the Pokémon.
 * @returns {string} The HTML template for the header of the Pokémon dialog.
 * 
 */
function templateDialogHeader(name, id, types) {
   return  `
            <div class="close-like-section">       
               <span class="dialog-pokemon-name" aria-label="Pokémon name">
                  ${name[0].toUpperCase() + name.replace("-f", "♀").replace("-m", "♂").slice(1)}
               </span>
               <button onclick="closeDialog()" type="button" class="close-like-btn" aria-label="Close dialog">
                  &times;
               </button>
            </div>
            <div class="dialog-pokemon-header-footer">
               <span class="numbers dialog-pokemon-number" aria-label="Pokémon number">#${id}</span>
               <img class="pokemon-card-img dialog-pokemon-img" src="https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${name}.png" alt="${name}">
               <div class="dialog-pokemon-type-container">
                  ${types.map(type => {
                     return `<span class="dialog-pokemon-type" aria-label="Pokémon type">${type}</span>`;
                  }).join("")}
               </div>
            </div>
         `
}

/**
 * Generates an HTML template for the "About" section of a Pokémon dialog.
 * @param {string} species - The species of the Pokémon.
 * @param {number} height - The height of the Pokémon in decimeters.
 * @param {number} weight - The weight of the Pokémon in hectograms.
 * @param {string|string[]} abilities - The abilities of the Pokémon.
 * @returns {string} The HTML template for the "About" section of the Pokémon dialog.
 */
function templateAboutData(species, height, weight, abilities) {
   return  `
            <tr>
               <td>Species</td>
               <td aria-label="Pokémon species">${species[0].toUpperCase() + species.replace("-mi", ". Mi").replace("-f", "♀").replace("-m", "♂").slice(1)}</td>
            </tr>
            <tr>
               <td>Height</td>
               <td aria-label="Pokémon height">${(height*10)} cm</td>
            </tr>
            <tr>
               <td>Weight</td>
               <td aria-label="Pokémon weight">${(weight/10).toFixed(1)} kg</td>
            </tr>
            <tr>
               <td>Abilities</td>
               <td aria-label="Pokémon abilities">
               ${(Array.isArray(abilities) ? abilities : [abilities]).map(ability =>
                  ability
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                  ).join(", ")}
               </td>
            </tr>
         `
}

/**
 * Generates an HTML template for the base stats section of a Pokémon dialog.
 * @param {number[]} templateBaseStatsData - An array containing the base stats of the Pokémon.
 * @returns {string} The HTML template for the base stats section of the Pokémon dialog. 
 */
function templateBaseStatsData(templateBaseStatsData) {
   let templateCollector = ""
   const statLabels = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"]
   for (let statIndex = 0; statIndex < templateBaseStatsData.length; statIndex++) {
      templateCollector +=  `
                              <tr>
                                 <td>${statLabels[statIndex]}</td>
                                 <td aria-label="Pokémon ${statLabels[statIndex]}">${templateBaseStatsData[statIndex]}</td>
                              </tr>
                           `
   };
   return templateCollector
}

/**
 * Generates an HTML template for the evolution data of a Pokémon.
 * @param {string[]} stages - An array containing the names of the Pokémon in each evolution stage.
 * @param {string[]} type - An array containing the types of the base form of the Pokémon.
 * @returns {string} The HTML template for the evolution data of the Pokémon.
 */
function templateTwoEvolutionsData(stages, type) {
   const labels = ["Base", "Stage 1", "Stage 2"];
   return stages.map((name, index) => 
      `
       <tr>
          <td>${labels[index]}</td>
          <td>
             <img src="https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/${name}.png" class="${type[0]}-evo-border">
             <span>
             ${name[0].toUpperCase() + name
                .replace("-f","♀")
                .replace("-m","♂")
                .replace("-"," ")
                .replace("jr","Jr.")
                .slice(1)}
             </span>
          </td>
       </tr>
       `).join("");
}

/**
 * Generates an HTML template for the moves data of a Pokémon.
 * @param {string[]} moves - An array containing the names of the moves of the Pokémon.
 * @returns {string} The HTML template for the moves data of the Pokémon.
 */
function templateMovesData(moves) {
   let templateCollector = ""
   for (let movesIndex = 0; movesIndex < moves.length; movesIndex++) {
      templateCollector += `
                            <tr>
                              <td>Move ${movesIndex + 1}</td>
                              <td aria-label="Move ${movesIndex + 1} name">
                              ${moves[movesIndex]
                                 .split("-")
                                 .map(word => word[0].toUpperCase() + word.slice(1))
                                 .join(" ")
                              }
                              </td>
                            </tr>
                           `
      
   }
   return templateCollector
}