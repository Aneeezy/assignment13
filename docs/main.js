const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let options = JSON.parse(localStorage.getItem("boardState") || '["", "", "", "", "", "", "", "", ""]');
let currentPlayer = localStorage.getItem("currentPlayer") || "X";
let running = true;
function initializeGame() {
  cells.forEach((cell, index) => {
    const cellElement = cell;
    cellElement.textContent = options[index];
    cellElement.addEventListener("click", () => cellClicked(index));
    cellElement.addEventListener("mouseenter", () => showPreview(index));
    cellElement.addEventListener("mouseleave", () => removePreview(index));
  });
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
}
function cellClicked(index) {
  if (options[index] !== "" || !running) return;
  updateCell(index);
  checkWinner();
}
function updateCell(index) {
  options[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  saveGameState();
}
function showPreview(index) {
  if (options[index] === "") {
    cells[index].textContent = currentPlayer;
    cells[index].style.opacity = "0.5";
  }
}
function removePreview(index) {
  if (options[index] === "") {
    cells[index].textContent = "";
    cells[index].style.opacity = "1";
  }
}
function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
  localStorage.setItem("currentPlayer", currentPlayer);
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
  } else if (!options.some((value) => value === "")) {
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
  cells.forEach((cell) => {
    const cellElement = cell;
    cellElement.textContent = "";
    cellElement.style.opacity = "1";
  });
  saveGameState();
}
function saveGameState() {
  localStorage.setItem("boardState", JSON.stringify(options));
  localStorage.setItem("currentPlayer", currentPlayer);
  localStorage.setItem("statusText", statusText.textContent || "");
}
initializeGame();
//# sourceMappingURL=main.js.map
