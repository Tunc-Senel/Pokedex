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
                <h2>${name[0].toUpperCase() + name.replace("-f", "♀").replace("-m", "♂").slice(1)}</h2>
                <span class="numbers">#${id}</span>
                </div>

                <img onclick="openDialog(${id})" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}">

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
                <h2>${name[0].toUpperCase() + name.replace("-mi", ". Mi").slice(1)}</h2>
                <span class="numbers">#${id}</span>
                </div>

                <img onclick="openDialog(${id})" class="pokemon-card-img ${type}-bg" src="./assets/img/${name}.png" alt="${name}">

                <div class="pokemon-card-footer">
                    <img class="pokemon-type-img-1" src="./assets/img/${type}.png" alt="${type}">
                    <img class="pokemon-type-img-2" src="./assets/img/${type2}.png" alt="${type2}">
                </div>
            </article>
         </li>
        `
}


function templateDialogHeader(name, id, type) {
return  `
            <div class="close-like-section">
                <span class="dialog-pokemon-name">
                    ${name[0].toUpperCase() + name.replace("-f", "♀").replace("-m", "♂").slice(1)}
                </span>
                <button onclick="closeDialog()" type="button" class="close-like-btn" aria-label="Fenster schließen">
                  &times;
                </button>
            </div>
            <div class="dialog-pokemon-header-footer">
                <span class="numbers dialog-pokemon-number">#${id}</span>
                <img class="pokemon-card-img dialog-pokemon-img" src="./assets/img/${name}.png" alt="${name}">
                <div class="dialog-pokemon-type-container">
                    <span class="dialog-pokemon-type">${type}</span>
                </div>
            </div>
        `
}

function templateDialogHeaderDualType(name, id, type, type2) {
return  `
            <div class="close-like-section">
                <span class="dialog-pokemon-name">
                    ${name[0].toUpperCase() + name.slice(1)}
                </span>
                <button onclick="closeDialog()" type="button" class="close-like-btn" aria-label="Fenster schließen">
                   &times;
                </button>
            </div>
            <div class="dialog-pokemon-header-footer">
                <span class="numbers dialog-pokemon-number">#${id}</span>
                <img class="pokemon-card-img dialog-pokemon-img" src="./assets/img/${name}.png" alt="${name}">
                <div class="dialog-pokemon-type-container">
                    <span class="dialog-pokemon-type">${type}</span>
                    <span class="dialog-pokemon-type">${type2}</span>
                </div>
            </div>
        `
}

function templateAboutData(species, height, weight, ability, ability2 = " ") {
return  `
         <tr>
            <td>Species</td>
            <td>${species[0].toUpperCase() + species.replace("-mi", ". Mi").replace("-f", "♀").replace("-m", "♂").slice(1)}</td>
         </tr>
         <tr>
            <td>Height</td>
            <td>${(height*10)} cm</td>
         </tr>
         <tr>
            <td>Weight</td>
            <td>${(weight/10).toFixed(1)} kg</td>
         </tr>
         <tr>
            <td>Abilities</td>
            <td>
               ${ability 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 }${ability2 && ability2.length > 1 ? ', ' + ability2.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ") : ''}
            </td>
         </tr>
        `
}

function templateBaseStatsData(hp, hpValue, attack, attackValue, defense, defenseValue, specialAttack, specialAttackValue, specialDefense, specialDefenseValue, speed, speedValue) {
return  `
         <tr>
            <td>${hp.toUpperCase()}</td>
            <td>${hpValue}</td>
         </tr>
         <tr>
            <td>${attack[0].toUpperCase() + attack.slice(1)}</td>
            <td>${attackValue}</td>
         </tr>
         <tr>
            <td>${defense[0].toUpperCase() + defense.slice(1)}</td>
            <td>${defenseValue}</td>
         </tr>
         <tr>
            <td>Sp. Atk</td>
            <td>${specialAttackValue}</td>
         </tr>
         <tr>
            <td>Sp. Def</td>
            <td>${specialDefenseValue}</td>
         </tr>
         <tr>
            <td>${speed[0].toUpperCase() + speed.slice(1)}</td>
            <td>${speedValue}</td>
         </tr>
        `
}

function templateTwoEvolutionsData(base, stage1, stage2, type) {
return  `
         <tr>
            <td>Base</td>
            <td>
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span>${base[0].toUpperCase() + base.replace("-f", "♀").replace("-m", "♂").replace("-", " ").replace("jr", "Jr.").slice(1)}<span/>
            </td>
         </tr>
         <tr>
            <td>Stage 1</td>
            <td>
               <img src="./assets/img/${stage1}.png" class="${type}-evo-border" alt="${stage1}">
               <span>${stage1[0].toUpperCase() + stage1.slice(1).replace("-m", ". M")}<span/>
            </td>

         </tr>
          <tr>
            <td>Stage 2</td>
            <td>
               <img src="./assets/img/${stage2}.png" class="${type}-evo-border" alt="${stage2}">
               <span>${stage2[0].toUpperCase() + stage2.slice(1).replace("-r", ". R").replace("-z", "-Z")}<span/>
            </td>
         </tr>
        `
}

function templateOneEvolutionData(base, stage1, type) {
return  `
         <tr>
            <td>Base</td>
            <td>
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span>${base[0].toUpperCase() + base.slice(1)}<span/>   
            </td>
         </tr>
         <tr>
            <td>Stage 1</td>
            <td>
               <img src="./assets/img/${stage1}.png" class="${type}-evo-border" alt="${stage1}">
               <span>${stage1[0].toUpperCase() + stage1.slice(1)}<span/>
            </td>
         </tr>
        `
}

function templateNoEvolutionData(base, type) {
return  `
         <tr>
            <td>Base</td>
            <td>
               <img src="./assets/img/${base}.png" class="${type}-evo-border" alt="${base}">
               <span>${base[0].toUpperCase() + base.slice(1)}<span/>     
            </td>
         </tr>
        `
}


function templateMovesData(move1, move2, move3, move4) {
return  `
         <tr>
            <td>Move 1</td>
            <td>${move1 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } 
            </td>
         </tr>
         <tr>
            <td>Move 2</td>
            <td>${move2 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } </td>
         </tr>
         <tr>
            <td>Move 3</td>
            <td>${move3 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } </td>
         </tr>
         <tr>
            <td>Move 4</td>
            <td>${move4 
                     .split("-")
                     .map(word => word[0].toUpperCase() + word.slice(1))
                     .join(" ")
                 } 
            </td>
         </tr>
        `
}