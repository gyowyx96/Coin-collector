const grid = document.querySelector('#grid');
const size = 25;
const rxc = size * size;
const cells = [];
const start = Math.floor(rxc / 2);
let pgIndex = start;

for (let i = 0; i < rxc; i++) {
    const cell = document.createElement('div');
    cells.push(cell)
    grid.appendChild(cell);
}

let pgId = cells[pgIndex];
let pgView = 'pgFront'

pgId.classList.add(pgView);

function movePg(direction) {
    function animateAndMove(addClass, condition, moveFn) {
        return new Promise(resolve => {
            pgId.classList.add(addClass);
            pgId.classList.remove(pgView);
            setTimeout(() => {
                pgId.classList.remove(addClass);
                resolve(condition);
            }, 100);
        }).then(condition => {
            if (condition) {
                moveFn();
                movement();
            } else {
                // Ripristina la posizione precedente se il personaggio ha toccato un bordo
                pgId.classList.remove(pgView);
                pgId.classList.add(pgView);
            }
        });
    }

    // Salva la posizione precedente
    const prevIndex = pgIndex;

    switch (direction) {
        case 'ArrowUp':
        case 'KeyW':
            pgView = 'pgBack';
            animateAndMove('pgUpMove', pgIndex - size >= 0, () => {
                if (pgIndex - size >= 0) {
                    pgIndex -= size;
                }
            });
            break;

        case 'ArrowDown':
        case 'KeyS':
            pgView = 'pgFront';
            animateAndMove('pgDownMove', pgIndex + size < rxc, () => {
                if (pgIndex + size < rxc) {
                    pgIndex += size;
                }
            });
            break;

        case 'ArrowLeft':
        case 'KeyA':
            pgView = 'pgLeft';
            animateAndMove('pgLeftMove', pgIndex % size !== 0, () => {
                if (pgIndex % size !== 0) {
                    pgIndex -= 1;
                }
            });
            break;

        case 'ArrowRight':
        case 'KeyD':
            pgView = 'pgRight';
            animateAndMove('pgRightMove', (pgIndex + 1) % size !== 0, () => {
                if ((pgIndex + 1) % size !== 0) {
                    pgIndex += 1;
                }
            });
            break;

        default:
            console.log('nothing happened');
            break;
    }
}

document.addEventListener('keydown', function (event) {
    movePg(event.code);
});



function movement() {
    pgId = cells[pgIndex];
    pgId.classList.add(pgView);
    clearBoard();
}

function clearBoard() {
    cells.forEach((element, index) => {
        const classesToRemove = ['pgRightMove', 'pgLeftMove', 'pgUpMove', 'pgDownMove', 'pgFront', 'pgBack', 'pgLeft', 'pgRight'];
        if (index !== pgIndex) {
            classesToRemove.forEach(className => element.classList.remove(className));
        }
    });
}
