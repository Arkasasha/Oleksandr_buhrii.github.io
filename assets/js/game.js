const cardData = [
  "🐶", "🐱", "🐻", "🦊", "🐼", "🐨",
  "🐯", "🦁", "🐸", "🐵", "🐙", "🐧"
];

const difficulties = {
  easy: { pairs: 6, columns: 4 },
  hard: { pairs: 12, columns: 6 }
};

const difficultySelect = document.getElementById("difficulty");
const board = document.getElementById("memoryBoard");
const startButton = document.getElementById("startGame");
const restartButton = document.getElementById("restartGame");
const movesCountEl = document.getElementById("movesCount");
const matchesCountEl = document.getElementById("matchesCount");
const bestScoreEl = document.getElementById("bestScore");
const timerEl = document.getElementById("timer");
const winMessageEl = document.getElementById("winMessage");

let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let gameStarted = false;

// Timer variables
let timer = 0;
let timerInterval = null;

// Load best results from localStorage
function loadBestScore() {
  const diff = difficultySelect.value;
  const best = localStorage.getItem("memory_best_" + diff);
  bestScoreEl.textContent = best ? best : "—";
}

function saveBestScore() {
  const diff = difficultySelect.value;
  const best = localStorage.getItem("memory_best_" + diff);

  if (!best || moves < parseInt(best)) {
    localStorage.setItem("memory_best_" + diff, moves);
    bestScoreEl.textContent = moves;
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = formatTime(timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = "00:00";
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateStats() {
  movesCountEl.textContent = moves;
  matchesCountEl.textContent = matchedPairs + " / " + totalPairs;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function showWinMessage() {
  winMessageEl.textContent = "You win! Total moves: " + moves;

  stopTimer();          // stop timer at win
  saveBestScore();      // check and save best result
}

function handleMatch() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  firstCard.removeEventListener("click", onCardClick);
  secondCard.removeEventListener("click", onCardClick);

  matchedPairs++;
  updateStats();
  resetTurn();

  if (matchedPairs === totalPairs) {
    showWinMessage();
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    if (firstCard) firstCard.classList.remove("flipped");
    if (secondCard) secondCard.classList.remove("flipped");
    resetTurn();
  }, 1000);
}

function onCardClick() {
  if (!gameStarted) return;
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  updateStats();

  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  if (isMatch) {
    handleMatch();
  } else {
    unflipCards();
  }
}

function createCard(symbol) {
  const card = document.createElement("div");
  card.classList.add("memory-card");
  card.dataset.symbol = symbol;

  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");
  front.textContent = "?";

  const back = document.createElement("div");
  back.classList.add("card-back");
  back.textContent = symbol;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", onCardClick);

  return card;
}

function prepareDifficultyChange() {
  // Stop and reset timer (but do NOT start)
  stopTimer();
  resetTimer();

  // Reset stats values
  moves = 0;
  matchedPairs = 0;
  totalPairs = difficulties[difficultySelect.value].pairs;

  movesCountEl.textContent = "0";
  matchesCountEl.textContent = "0 / " + totalPairs;

  // Clear win message
  winMessageEl.textContent = "";

  // Load best score for selected difficulty
  loadBestScore();

  // Remove all cards from the board
  board.innerHTML = "";

  // Prevent gameplay until Start is clicked
  gameStarted = false;
}

function initGame() {
  const difficulty = difficultySelect.value;
  const { pairs, columns } = difficulties[difficulty];

  totalPairs = pairs;
  moves = 0;
  matchedPairs = 0;
  resetTurn();
  winMessageEl.textContent = "";
  gameStarted = true;

  updateStats();
  loadBestScore(); // read saved best score

  resetTimer();
  startTimer();

  board.innerHTML = "";
  board.style.setProperty("--columns", columns);

  const selected = cardData.slice(0, pairs);
  const fullDeck = shuffle(selected.concat(selected));

  fullDeck.forEach(symbol => {
    board.appendChild(createCard(symbol));
  });
}

// Event listeners
startButton.addEventListener("click", () => {
  initGame();
});

restartButton.addEventListener("click", () => {
  initGame();
});

difficultySelect.addEventListener("change", () => {
  prepareDifficultyChange();
});

// Initial load
loadBestScore();