const tilesContainer = document.querySelector('.tiles');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

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
  tile.style.top  = (i * 116) + 'px';
  tile.style.left = (j * 116) + 'px';
  tilesContainer.appendChild(tile);
}

// старт игры
addRandomTile();
addRandomTile();