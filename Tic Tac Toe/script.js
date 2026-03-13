const gameContainer = document.getElementById('game');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');

let board = Array(9).fill(null);
let gameOver = false;
let difficulty = difficultySelect.value;

difficultySelect.addEventListener('change', () => {
  difficulty = difficultySelect.value;
  restartGame();
});

function createBoard() {
  gameContainer.innerHTML = '';
  board.forEach((cell, index) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = index;
    div.textContent = cell || '';
    div.addEventListener('click', handleClick);
    gameContainer.appendChild(div);
  });
}

function handleClick(e) {
  const i = e.target.dataset.index;
  if (board[i] || gameOver) return;

  board[i] = 'X';
  updateBoard();
  if (checkGame()) return;

  setTimeout(computerMove, 300); 
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.textContent = board[index] || '';
  });
}

function checkGame() {
  const winner = checkWinner();
  if (winner) {
    statusDiv.textContent = winner === 'draw' ? 'Draw!' : `${winner} wins!`;
    gameOver = true;
    return true;
  }
  return false;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== null)) return 'draw';
  return null;
}

function computerMove() {
  const available = board.map((val, i) => val === null ? i : null).filter(val => val !== null);
  if (available.length === 0) return;

  let move;

  if (difficulty === 'easy') {
    move = available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === 'medium') {
    move = findBlockingMove() ?? available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === 'hard') {
    move = findBestMove();
  }

  board[move] = 'O';
  updateBoard();
  checkGame();
}

function findBlockingMove() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of winPatterns) {
    if (board[a] === 'X' && board[b] === 'X' && board[c] === null) return c;
    if (board[a] === 'X' && board[c] === 'X' && board[b] === null) return b;
    if (board[b] === 'X' && board[c] === 'X' && board[a] === null) return a;
  }

  return null;
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  const result = checkWinnerForMinimax();
  if (result !== null) {
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinnerForMinimax() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== null)) return 'draw';
  return null;
}

function restartGame() {
  board = Array(9).fill(null);
  gameOver = false;
  statusDiv.textContent = '';
  createBoard();
}

restartBtn.addEventListener('click', restartGame);

createBoard();