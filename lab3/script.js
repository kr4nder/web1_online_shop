const tilesContainer = document.querySelector('.tiles');
const gridContainer = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const recordsList = document.getElementById('records');
const newGameBtn = document.getElementById('newGameBtn');

// динамическое создание сетки
function createGrid() {
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    gridContainer.appendChild(cell);
  }
}
createGrid();

let board;
let score;

// сохранение в localStorage
function saveGame() {
  localStorage.setItem("board2048", JSON.stringify(board));
  localStorage.setItem("score2048", score.toString());
}

function loadGame() {
  const savedBoard = localStorage.getItem("board2048");
  const savedScore = localStorage.getItem("score2048");

  if (savedBoard && savedScore) {
    board = JSON.parse(savedBoard);
    score = Number(savedScore);
    scoreDisplay.textContent = score;
    return true;
  }
  return false;
}

// рекорды
function saveRecord(newScore) {
  let records = JSON.parse(localStorage.getItem("records2048")) || [];

  records.push(newScore);
  records.sort((a, b) => b - a);
  records = records.slice(0, 10);

  localStorage.setItem("records2048", JSON.stringify(records));
  renderRecords();
}

function renderRecords() {
  recordsList.innerHTML = ""; 

  const records = JSON.parse(localStorage.getItem("records2048")) || [];

  records.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r}`;
    recordsList.appendChild(li);
  });
}

// игровая логика

// генерация новой плитки
function addRandomTile() {
  const empty = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) empty.push({i, j});
    }
  }
  if (empty.length === 0) return;

  const {i, j} = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  board[i][j] = value;

  const tile = document.createElement('div');
  tile.className = `tile tile-${value}`;
  tile.textContent = value;
  tile.dataset.row = i;
  tile.dataset.col = j;
  tile.style.top  = (i * 116) + 'px';
  tile.style.left = (j * 116) + 'px';
  tilesContainer.appendChild(tile);
}

// отрисовка доски
function renderBoard() {
  document.querySelectorAll('.tile').forEach(t => t.remove());

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${board[i][j]}`;
        tile.textContent = board[i][j];
        tile.dataset.row = i;
        tile.dataset.col = j;
        tile.style.top  = (i * 116) + 'px';
        tile.style.left = (j * 116) + 'px';
        tilesContainer.appendChild(tile);
      }
    }
  }
}

// обработка линий
function processLine(line) {
  const filtered = line.filter(x => x !== 0);
  let result = [];
  let gained = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      gained += merged;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }

  while (result.length < 4) result.push(0);

  return { line: result, score: gained };
}

// движения
function moveLeft(board) {
  let gained = 0;
  let newBoard = [];

  for (let i = 0; i < 4; i++) {
    const {line, score} = processLine(board[i]);
    newBoard.push(line);
    gained += score;
  }

  return { board: newBoard, score: gained };
}

function moveRight(board) {
  let gained = 0;
  let newBoard = [];

  for (let i = 0; i < 4; i++) {
    const reversed = [...board[i]].reverse();
    const {line, score} = processLine(reversed);
    newBoard.push(line.reverse());
    gained += score;
  }

  return { board: newBoard, score: gained };
}

function moveUp(board) {
  let gained = 0;
  let newBoard = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];

  for (let col = 0; col < 4; col++) {
    let column = [
      board[0][col],
      board[1][col],
      board[2][col],
      board[3][col]
    ];

    const {line, score} = processLine(column);
    gained += score;

    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = line[row];
    }
  }

  return { board: newBoard, score: gained };
}

function moveDown(board) {
  let gained = 0;
  let newBoard = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];

  for (let col = 0; col < 4; col++) {
    let column = [
      board[0][col],
      board[1][col],
      board[2][col],
      board[3][col]
    ];

    const reversed = column.reverse();
    const {line, score} = processLine(reversed);
    gained += score;

    const restored = line.reverse();

    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = restored[row];
    }
  }

  return { board: newBoard, score: gained };
}

// проверка конца игры
function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false;
      if (i < 3 && board[i][j] === board[i+1][j]) return false;
      if (j < 3 && board[i][j] === board[i][j+1]) return false;
    }
  }
  return true;
}

function handleGameOver() {
  alert("Игра окончена!");
  saveRecord(score);
  startNewGame();
}

// обработка хода
document.addEventListener("keydown", (e) => {
  let result = null;

  if (e.key === "ArrowLeft")  result = moveLeft(board);
  if (e.key === "ArrowRight") result = moveRight(board);
  if (e.key === "ArrowUp")    result = moveUp(board);
  if (e.key === "ArrowDown")  result = moveDown(board);

  if (!result) return;

  const moved = JSON.stringify(result.board) !== JSON.stringify(board);

  if (moved) {
    board = result.board;
    score += result.score;
    scoreDisplay.textContent = score;

    addRandomTile();
    renderBoard();
    saveGame();

    if (isGameOver()) {
      handleGameOver();
    }
  }
});

// новая игра
function startNewGame() {
  board = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  score = 0;
  tilesContainer.innerHTML = '';
  addRandomTile();
  addRandomTile();
  renderBoard();
  scoreDisplay.textContent = score;
  saveGame();
}

newGameBtn.addEventListener('click', startNewGame);

// старт игры (загрузка сохранённого)
if (!loadGame()) {
  startNewGame();
}

renderBoard();
renderRecords();
