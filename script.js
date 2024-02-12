const grid = document.querySelector('#grid');
const size = 25;
const rxc = size * size;
const cells = [];
const start = Math.floor(rxc / 2);

for (let i = 0; i < rxc; i++) {
    const cell = document.createElement('div');
    cells.push(cell)
    grid.appendChild(cell);
}

let pgIndex = start;
let pgId = cells[pgIndex];

pgId.classList.add('pgFront');

function movePg(direction) {

    function animateAndMove(addClass, condition, moveFn) {
        pgId.classList.add(addClass);
        setTimeout(function () {
            pgId.classList.remove(addClass);
            if (condition) {
                moveFn();
                movement();
            }
        }, 50);
    }

    switch (direction) {
        case 'ArrowUp':
        case 'KeyW':
            animateAndMove('pgUpMove', pgIndex - size >= 0, () => {
                if (pgIndex - size >= 0) {
                    pgIndex -= size;
                }
            });
            break;

        case 'ArrowDown':
        case 'KeyS':
            animateAndMove('pgDownMove', pgIndex + size < rxc, () => {
                if (pgIndex + size < rxc) {
                    pgIndex += size;
                }
            });
            break;

        case 'ArrowLeft':
        case 'KeyA':
            animateAndMove('pgLeftMove', pgIndex % size !== 0, () => {
                if (pgIndex % size !== 0) {
                    pgIndex -= 1;
                }
            });
            break;

        case 'ArrowRight':
        case 'KeyD':
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
    pgId.classList.add('pgFront');
    clearBoard();
}

//rimuovi da tutte le cella tranne quella corrente le classi
function clearBoard() {
    cells.forEach((element, index) => {
        const classesToRemove = ['pgRightMove', 'pgLeftMove', 'pgUpMove', 'pgDownMove', 'pgFront'];
        if (index !== pgIndex) {
            classesToRemove.forEach(className => element.classList.remove(className));
        }
    });
}

