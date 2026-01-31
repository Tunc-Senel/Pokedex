// Template functions for generating HTML content for Pokémon cards and dialogs.

/**
 * Generates an HTML template for a Pokémon card.
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
                  <h2 aria-label="Pokémon name">${name[0].toUpperCase() + name.replace("-f", "♀").replace("-m", "♂").slice(1)}</h2>
                  <span class="numbers" aria-label="Pokémon number">#${id}</span>
                </div>

                <img onclick="openDialog(${id})" onkeydown="event.key === 'Enter' && openDialog(${id}) || event.key === ' ' && openDialog(${id})" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}" tabindex="0">

                <div class="pokemon-card-footer">
                  <img class="pokemon-type-img" src="./assets/img/${type}.png" alt="Pokemon type ${type}">
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
                <h2 aria-label="Pokémon name">${name[0].toUpperCase() + name.replace("-mi", ". Mi").slice(1)}</h2>
                <span class="numbers" aria-label="Pokémon number">#${id}</span>
                </div>

                <img onclick="openDialog(${id})" onkeydown="event.key === 'Enter' && openDialog(${id}) || event.key === ' ' && openDialog(${id})" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}" tabindex="0">

                <div class="pokemon-card-footer">
                    <img class="pokemon-type-img-1" src="./assets/img/${type}.png" alt="Pokémon type ${type}">
                    <img class="pokemon-type-img-2" src="./assets/img/${type2}.png" alt="Pokémon type ${type2}">
                </div>
            </article>
         </li>
        `
}

/**
 * Generates an HTML template for the header of a Pokémon dialog.
 * @param {string} name - The name of the Pokémon. 
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @returns {string} The HTML template for the Pokémon dialog header.
 */
function templateDialogHeader(name, id, type) {
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
               <img class="pokemon-card-img dialog-pokemon-img" src="./assets/img/${name}.png" alt="${name}">
               <div class="dialog-pokemon-type-container">
                  <span class="dialog-pokemon-type" aria-label="Pokémon type">${type}</span>
               </div>
         </div>
        `
}

/**
 * Generates an HTML template for the header of a dual-type Pokémon dialog.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The unique identifier for the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @param {string} type2 - The secondary type of the Pokémon.
 * @returns {string} The HTML template for the dual-type Pokémon dialog header.
 */
function templateDialogHeaderDualType(name, id, type, type2) {
return  `
            <div class="close-like-section">
                <span class="dialog-pokemon-name" aria-label="Pokémon name">
                    ${name[0].toUpperCase() + name.slice(1)}
                </span>
                <button onclick="closeDialog()" type="button" class="close-like-btn" aria-label="Close dialog">
                   &times;
                </button>
            </div>
            <div class="dialog-pokemon-header-footer">
                <span class="numbers dialog-pokemon-number" aria-label="Pokémon number">#${id}</span>
                <img class="pokemon-card-img dialog-pokemon-img" src="./assets/img/${name}.png" alt="${name}">
                <div class="dialog-pokemon-type-container">
                    <span class="dialog-pokemon-type" aria-label="Pokémon type">${type}</span>
                    <span class="dialog-pokemon-type" aria-label="Pokémon type">${type2}</span>
                </div>
            </div>
        `
}

/**
 * Generates an HTML template for the "About" section of a Pokémon dialog.
 * @param {string} species - The species of the Pokémon.
 * @param {number} height - The height of the Pokémon in decimeters.
 * @param {number} weight - The weight of the Pokémon in hectograms.
 * @param {string} ability - The primary ability of the Pokémon.
 * @param {string} ability2 - The secondary ability of the Pokémon (optional).
 * @returns {string} The HTML template for the "About" section of the Pokémon dialog.
 */
function templateAboutData(species, height, weight, ability, ability2 = " ") {
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
               ${ability 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 }${ability2 && ability2.length > 1 ? ', ' + ability2.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ") : ''}
            </td>
         </tr>
        `
}

/**
 * Generates an HTML template for the base stats section of a Pokémon dialog.
 * @param {string} hp - The HP stat label.
 * @param {number} hpValue - The HP stat value.
 * @param {string} attack - The Attack stat label.
 * @param {number} attackValue - The Attack stat value.
 * @param {string} defense - The Defense stat label.
 * @param {number} defenseValue - The Defense stat value.
 * @param {string} specialAttack - The Special Attack stat label.
 * @param {number} specialAttackValue - The Special Attack stat value.
 * @param {string} specialDefense - The Special Defense stat label.
 * @param {number} specialDefenseValue - The Special Defense stat value.
 * @param {string} speed - The Speed stat label.
 * @param {number} speedValue - The Speed stat value.
 * @returns {string} The HTML template for the base stats section of the Pokémon dialog.
 */
function templateBaseStatsData(hp, hpValue, attack, attackValue, defense, defenseValue, specialAttack, specialAttackValue, specialDefense, specialDefenseValue, speed, speedValue) {
return  `
         <tr>
            <td>${hp.toUpperCase()}</td>
            <td aria-label="Pokémon HP">${hpValue}</td>
         </tr>
         <tr>
            <td>${attack[0].toUpperCase() + attack.slice(1)}</td>
            <td aria-label="Pokémon Attack">${attackValue}</td>
         </tr>
         <tr>
            <td>${defense[0].toUpperCase() + defense.slice(1)}</td>
            <td aria-label="Pokémon Defense">${defenseValue}</td>
         </tr>
         <tr>
            <td>Sp. Atk</td>
            <td aria-label="Pokémon Special Attack">${specialAttackValue}</td>
         </tr>
         <tr>
            <td>Sp. Def</td>
            <td aria-label="Pokémon Special Defense">${specialDefenseValue}</td>
         </tr>
         <tr>
            <td>${speed[0].toUpperCase() + speed.slice(1)}</td>
            <td aria-label="Pokémon Speed">${speedValue}</td>
         </tr>
        `
}

/**
 * Generates an HTML template for the evolution data of a Pokémon with two evolutions.
 * @param {string} base - The name of the base form of the Pokémon.
 * @param {string} stage1 - The name of the first evolution stage of the Pokémon.
 * @param {string} stage2 - The name of the second evolution stage of the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @returns {string} The HTML template for the evolution data of the Pokémon.
 */
function templateTwoEvolutionsData(base, stage1, stage2, type) {
return  `
         <tr>
            <td>Base</td>
            <td aria-label="Base form image and name">
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span aria-label="Base form">${base[0].toUpperCase() + base.replace("-f", "♀").replace("-m", "♂").replace("-", " ").replace("jr", "Jr.").slice(1)}<span/>
            </td>
         </tr>
         <tr>
            <td>Stage 1</td>
            <td aria-label="Stage 1 form image and name">
               <img src="./assets/img/${stage1}.png" class="${type}-evo-border" alt="${stage1}">
               <span aria-label="Stage 1 form">${stage1[0].toUpperCase() + stage1.slice(1).replace("-m", ". M")}<span/>
            </td>

         </tr>
          <tr>
            <td>Stage 2</td>
            <td aria-label="Stage 2 form image and name">
               <img src="./assets/img/${stage2}.png" class="${type}-evo-border" alt="${stage2}">
               <span aria-label="Stage 2 form">${stage2[0].toUpperCase() + stage2.slice(1).replace("-r", ". R").replace("-z", "-Z")}<span/>
            </td>
         </tr>
        `
}

/**
 * Generates an HTML template for the evolution data of a Pokémon with one evolution.
 * @param {string} base - The name of the base form of the Pokémon.
 * @param {string} stage1 - The name of the first evolution stage of the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @returns {string} The HTML template for the evolution data of the Pokémon.
 */
function templateOneEvolutionData(base, stage1, type) {
return  `
         <tr>
            <td>Base</td>
            <td aria-label="Base form image and name">
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span aria-label="Base form">${base[0].toUpperCase() + base.slice(1)}<span/>   
            </td>
         </tr>
         <tr>
            <td>Stage 1</td>
            <td aria-label="Stage 1 form image and name">
               <img src="./assets/img/${stage1}.png" class="${type}-evo-border" alt="${stage1}">
               <span aria-label="Stage 1 form">${stage1[0].toUpperCase() + stage1.slice(1)}<span/>
            </td>
         </tr>
        `
}

/**
 * Generates an HTML template for the evolution data of a Pokémon with no evolutions.
 * @param {string} base - The name of the base form of the Pokémon.
 * @param {string} type - The primary type of the Pokémon.
 * @returns {string} The HTML template for the evolution data of the Pokémon.
 */
function templateNoEvolutionData(base, type) {
return  `
         <tr>
            <td>Base</td>
            <td aria-label="Base form image and name">
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span aria-label="Base form">${base[0].toUpperCase() + base.slice(1)}<span/>     
            </td>
         </tr>
        `
}

/**
 * Generates an HTML template for the moves data of a Pokémon.
 * @param {string} move1 - The name of the first move.
 * @param {string} move2 - The name of the second move.
 * @param {string} move3 - The name of the third move.
 * @param {string} move4 - The name of the fourth move.
 * @returns {string} The HTML template for the moves data of the Pokémon.
 */
function templateMovesData(move1, move2, move3, move4) {
return  `
         <tr>
            <td>Move 1</td>
            <td aria-label="Move 1 name">${move1 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } 
            </td>
         </tr>
         <tr>
            <td>Move 2</td>
            <td aria-label="Move 2 name">${move2 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } </td>
         </tr>
         <tr>
            <td>Move 3</td>
            <td aria-label="Move 3 name" >${move3 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } </td>
         </tr>
         <tr>
            <td>Move 4</td>
            <td aria-label="Move 4 name">${move4 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } 
            </td>
         </tr>
        `
}