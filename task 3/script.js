const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.textContent = ''; 
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.textContent = ''; 
    clearLines(); 
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        messageElement.textContent = 'Draw!';
    } else {
        messageElement.textContent = `${circleTurn ? "O's" : "X's"} Wins!`;
        drawWinningLine(); 
    }
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O'; 
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function drawWinningLine() {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(circleTurn ? CIRCLE_CLASS : X_CLASS);
        });
    });
    if (!winningCombination) return;

    const [start, middle, end] = winningCombination;
    const startCell = cellElements[start];
    const endCell = cellElements[end];
    
    const line = document.createElement('div');
    line.classList.add('line');

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const boardRect = board.getBoundingClientRect();

    const startX = startRect.left - boardRect.left + startRect.width / 2;
    const startY = startRect.top - boardRect.top + startRect.height / 2;
    const endX = endRect.left - boardRect.left + endRect.width / 2;
    const endY = endRect.top - boardRect.top + endRect.height / 2;

    const length = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX);

    line.style.width = `${length}px`;
    line.style.top = `${startY}px`;
    line.style.left = `${startX}px`;
    line.style.transform = `rotate(${angle}rad) scaleX(1)`;

    board.appendChild(line);
}

function clearLines() {
    const lines = document.querySelectorAll('.line');
    lines.forEach(line => line.remove());
}
