export function getAIMove(board, aiSymbol, difficulty) {
  if (difficulty === "easy") {
    const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
  } else {
    return minimaxMove(board, aiSymbol).index;
  }
}

function minimaxMove(newBoard, player) {
  const availSpots = newBoard.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  const huPlayer = player === "X" ? "O" : "X";

  if (checkWin(newBoard, huPlayer)) return { score: -10 };
  if (checkWin(newBoard, player)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    const result = minimaxMove(newBoard, player === "X" ? "O" : "X");
    move.score = result.score;

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "X") {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}
