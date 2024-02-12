const grid = document.querySelector('#grid');
const size = 15;
const rxc = size * size;
const cells = [];
const start = Math.floor(rxc / 2);
let pgIndex = start;

// Creazione della griglia di celle nel DOM
for (let i = 0; i < rxc; i++) {
    const cell = document.createElement('div');
    cells.push(cell)
    grid.appendChild(cell);
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
                if (pgIndex + size < rxc) {
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

// Aggiungi un listener per gestire i tasti premuti
document.addEventListener('keydown', function (event) {
    movePg(event.code);
});

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
