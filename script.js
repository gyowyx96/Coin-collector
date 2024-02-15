//Inizializzazione variabili//
const grid = document.querySelector('#grid');
const size = 15;
const rxc = size * size;
const cells = [];
const start = Math.floor(rxc / 2);
const score = document.querySelector('#score');
const timer = document.querySelector('#time');
const lifePool = document.querySelector('#life');
const coinCells =  [];
const bombCounter = [];
const bonusCounter = [];
const bonusList = ['hp','time'];
let lifeToRemove = Array.from(lifePool.querySelectorAll('.life-cell'));
let bonusOnBoard = false;
let currentBonus = ''; 

let scorePoint = 0;
let time = 25;
score.innerHTML = scorePoint;
timer.innerHTML = time;
let pgIndex = start;


// Creazione della griglia di celle nel DOM
for (let i = 0; i < rxc; i++) {
    const cell = document.createElement('div');
    cells.push(cell)
    grid.appendChild(cell);
}

//Creazione degli elementi di scena
for (let i = 0; i <= 10; i++) {
    let x = Math.floor(Math.random() * cells.length);
    if (cells[x].classList.length === 0) {
        cells[x].classList.add('rock');
    } 
    else {
        i--;
    }
}

// Inizializzazione del personaggio alla posizione di partenza
let pgId = cells[pgIndex];
let pgView = 'pgFront' 
pgId.classList.add(pgView);// Direzione iniziale del personaggio

// Funzione per gestire il movimento del personaggio
function movePg(direction) {
    // Funzione per animare e muovere il personaggio con una promessa
    async function animateAndMove(addClass, condition, moveFn) {
        const condition_1 = await new Promise(resolve => {
            // Aggiungi la classe per l'animazione
            pgId.classList.add(addClass);
            // Rimuovi la classe corrente che indica la direzione
            pgId.classList.remove(pgView);
            setTimeout(() => {
                // Rimuovi la classe dell'animazione dopo un ritardo
                pgId.classList.remove(addClass);
                // Risolvi la promessa con il valore di condition
                resolve(condition);
            }, 100);
        });
        // Una volta risolta la promessa, esegui le azioni necessarie
        if (condition_1) {
            moveFn();
            movement();
            getCoin();
        } else {
            // Ripristina la posizione precedente se il personaggio ha toccato un bordo
            pgId.classList.remove(pgView);
            pgId.classList.add(pgView);
        }
    }

    // Salva la posizione precedente
    const prevIndex = pgIndex;

    // Gestisci il movimento in base al tasto premuto
    switch (direction) {
        case 'ArrowUp':
        case 'KeyW':
            pgView = 'pgBack'; 
            animateAndMove('pgUpMove', pgIndex - size >= 0, () => {
                if (pgIndex - size >= 0) {
                    pgIndex -= size; // Muovi il personaggio verso l'alto
                }
            });
            break;

        case 'ArrowDown':
        case 'KeyS':
            pgView = 'pgFront'; 
            animateAndMove('pgDownMove', pgIndex + size < rxc, () => {
                if (pgIndex + size < rxc && !containRock(pgIndex + size)) {
                    pgIndex += size; // Muovi il personaggio verso il basso
                }
            });
            break;

        case 'ArrowLeft':
        case 'KeyA':
            pgView = 'pgLeft'; 
            animateAndMove('pgLeftMove', pgIndex % size !== 0, () => {
                if (pgIndex % size !== 0) {
                    pgIndex -= 1; // Muovi il personaggio verso sinistra
                }
            });
            break;

        case 'ArrowRight':
        case 'KeyD':
            pgView = 'pgRight'; 
            animateAndMove('pgRightMove', (pgIndex + 1) % size !== 0, () => {
                if ((pgIndex + 1) % size !== 0) {
                    pgIndex += 1; // Muovi il personaggio verso destra
                }
            });
            break;

        default:
            console.log('nothing happened');
            break;
    }
}

// Aggiungta di un listener per gestire i tasti premuti
const keyDownHandler = function(event) {
    movePg(event.code);
}
document.addEventListener('keydown', keyDownHandler);

// Funzione chiamata dopo il movimento per aggiornare l'aspetto del personaggio
function movement() {
    pgId = cells[pgIndex];
    pgId.classList.add(pgView);
    clearBoard();
}

// Funzione per rimuovere le classi di movimento dalle celle, tranne quella corrente
function clearBoard() {
    cells.forEach((element, index) => {
        const classesToRemove = ['pgRightMove', 'pgLeftMove', 'pgUpMove', 'pgDownMove', 'pgFront', 'pgBack', 'pgLeft', 'pgRight'];
        if (index !== pgIndex) {
            classesToRemove.forEach(className => element.classList.remove(className));
        }
    });
}

//interazione con elementi di gioco
function getCoin(){
    if (pgId.classList.contains('coin')){
        scorePoint++;
        score.innerHTML = scorePoint;
        pgId.classList.remove('coin');        
        /* pgId.classList.add('glow') */
    }
    if (pgId.classList.contains('hp')){
        const newLifeCell = document.createElement('div')
        newLifeCell.classList.add('life-cell');
        lifePool.appendChild(newLifeCell);
        lifeToRemove = Array.from(lifePool.querySelectorAll('.life-cell'));
        pgId.classList.remove('hp');
        bonusOnBoard = false;
    }
    if (pgId.classList.contains('time')){
        time = time + 10;
        timer.innerHTML = time;
        pgId.classList.remove('time')
        bonusOnBoard = false;
    }
    if (pgId.classList.contains('bomb')) {
        pgId.classList.remove('bomb');
        loseLife();
    }
}

function loseLife(){
    if (lifeToRemove.length > 1) {
        const removedElement = lifeToRemove.pop();
        removedElement.remove();
    }
    else{
        const removedElement = lifeToRemove.pop();
        removedElement.remove();
        time = 0
        timer.innerHTML = time;
        gameOver();
        //aggiungi l'alert a schermo
    }
}

//Gestione elementi su schermo
function coinSpawn() {
    let i = Math.floor(Math.random() * cells.length);
    coinDespawn(coinCells);

    if (cells[i].classList.length === 0) {
        coinCells.push(cells[i]);
        cells[i].classList.add('coin');
    } else {
        coinSpawn();
    }
}

function coinDespawn(array) {
    if (array.length >= 4){
        array[0].classList.remove('coin');
        array = array.shift();
    }
}

function bombSpawn() {
    let i = Math.floor(Math.random() * cells.length);

    if (bombCounter.length >= 10) {
        bombCounter[0].classList.remove('bomb');
        bombCounter.shift();
    }
    if (cells[i].classList.length === 0) {
        bombCounter.push(cells[i]);
        cells[i].classList.add('bomb');
    } else {
        bombSpawn();
    }
}

const gameInterval = setInterval(function(){
    if (time > 0){
    coinSpawn();
    bombSpawn();
    time--;
    timer.innerHTML = time;
    }
    else{
        gameOver();
    }
},1000);

// game over function and alert
function gameOver(){
    cells.forEach((element, index) => {
        const classesToRemove = ['coin', 'bomb', 'hp', 'time', 'rock'];
        if (index !== pgIndex) {
            classesToRemove.forEach(className => element.classList.remove(className));
        }
    });
    document.removeEventListener('keydown', keyDownHandler);
    pgId.className = '';
    showAlert('Game Over!');
    clearInterval(gameInterval);
    clearInterval(addBonus);
    clearInterval(removeBonus);
}

function plusBonus() {
    let i = Math.floor(Math.random() * cells.length);
    let z = Math.floor(Math.random() * bonusList.length)
    currentBonus = bonusList[z];
    console.log(currentBonus);

    if (cells[i].classList.length === 0) {
        bonusCounter.push(cells[i]);
        cells[i].classList.add(currentBonus);
    }
}

const addBonus = setInterval(function(){    
    if(!bonusOnBoard){
        plusBonus();
        bonusOnBoard = true;
    }
},5000);

 function bonusDespawn(){
    if (bonusOnBoard && bonusCounter.length > 0){
        let asd = bonusCounter.pop();
        asd.classList.remove(currentBonus);
        bonusOnBoard = false;
    }
}

const removeBonus = setInterval(function(){
    bonusDespawn();
}, 4999);

function containRock(futureCell) {
    return futureCell.classList.contains('rock');
}



  

