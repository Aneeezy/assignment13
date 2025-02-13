const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector("#statusText") as HTMLElement;
const restartBtn = document.querySelector("#restartBtn") as HTMLElement;
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Load game state from localStorage
let options: string[] = JSON.parse(localStorage.getItem("boardState") || '["", "", "", "", "", "", "", "", ""]');
let currentPlayer: string = localStorage.getItem("currentPlayer") || "X";
let running: boolean = true;

function initializeGame() {
    cells.forEach((cell, index) => {
        const cellElement = cell as HTMLElement;

        // Restore board state
        cellElement.textContent = options[index];

        // Add event listeners
        cellElement.addEventListener("click", () => cellClicked(index));
        cellElement.addEventListener("mouseenter", () => showPreview(index));
        cellElement.addEventListener("mouseleave", () => removePreview(index));
    });

    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
}

function cellClicked(index: number) {
    if (options[index] !== "" || !running) return;

    updateCell(index);
    checkWinner();
}

function updateCell(index: number) {
    options[index] = currentPlayer;
    (cells[index] as HTMLElement).textContent = currentPlayer;

    saveGameState(); // Save to localStorage
}

function showPreview(index: number) {
    if (options[index] === "") {
        (cells[index] as HTMLElement).textContent = currentPlayer;
        (cells[index] as HTMLElement).style.opacity = "0.5"; // Faded effect
    }
}

function removePreview(index: number) {
    if (options[index] === "") {
        (cells[index] as HTMLElement).textContent = "";
        (cells[index] as HTMLElement).style.opacity = "1";
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    localStorage.setItem("currentPlayer", currentPlayer); // Save current player
}

function checkWinner() {
    let roundWon = false;

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (options[a] !== "" && options[a] === options[b] && options[b] === options[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.some(value => value === "")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;

    cells.forEach(cell => {
        const cellElement = cell as HTMLElement;
        cellElement.textContent = "";
        cellElement.style.opacity = "1"; // Reset opacity
    });

    saveGameState(); // Reset localStorage
}

function saveGameState() {
    localStorage.setItem("boardState", JSON.stringify(options));
    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("statusText", statusText.textContent || ""); // Fixed this line
}


initializeGame();
