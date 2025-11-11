import React, { useState, useEffect } from "react";
import { getAIMove } from "./AI";
import "./App.css";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null); // "pvp" or "ai"
  const [difficulty, setDifficulty] = useState("easy");
  const [playerSymbol, setPlayerSymbol] = useState("X");

  const currentPlayer = xNext ? "X" : "O";

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = currentPlayer;
    setBoard(newBoard);
    setXNext(!xNext);
  };

  // Check for winner
  useEffect(() => {
    const win = checkWinner(board);
    if (win) setWinner(win);
    else if (!board.includes(null)) setWinner("Draw");
  }, [board]);

  // AI Move
  useEffect(() => {
    if (mode === "ai" && !winner) {
      const aiTurn = (xNext && playerSymbol === "O") || (!xNext && playerSymbol === "X");
      if (aiTurn) {
        const move = getAIMove(board, xNext ? "X" : "O", difficulty);
        if (move !== null) {
          setTimeout(() => handleClick(move), 500);
        }
      }
    }
  }, [xNext, board, mode, difficulty, playerSymbol, winner]);

  function checkWinner(b) {
    for (const [a, b1, c] of WIN_LINES) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXNext(true);
  };

  // Mode selection screen
  if (!mode) {
    return (
      <div className="start-screen">
        <h1>Tic Tac Toe 🎮</h1>
        <button onClick={() => setMode("pvp")}>🧍 Player vs Player</button>
        <button onClick={() => setMode("ai")}>🤖 Player vs Computer</button>
      </div>
    );
  }

  // If AI mode, show difficulty & symbol choices first
  if (mode === "ai" && !playerSymbol) {
    return (
      <div className="start-screen">
        <h1>Choose Your Symbol</h1>
        <button onClick={() => setPlayerSymbol("X")}>Play as X</button>
        <button onClick={() => setPlayerSymbol("O")}>Play as O</button>
      </div>
    );
  }

  return (
    <div className="game">
      {mode === "ai" && (
        <div className="settings">
          <span>Difficulty:</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={resetGame}>Reset</button>
        </div>
      )}

      <div className="board">
        {board.map((val, i) => (
          <button
            key={i}
            className="cell"
            onClick={() => handleClick(i)}
            disabled={winner || (mode === "ai" && ((xNext && playerSymbol === "O") || (!xNext && playerSymbol === "X")))}
          >
            {val}
          </button>
        ))}
      </div>

      <div className="status">
        {winner ? (
          <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
        ) : (
          <h3>Turn: {currentPlayer}</h3>
        )}
      </div>

      <button className="back" onClick={() => window.location.reload()}>
        🔙 Back to Menu
      </button>
    </div>
  );
}
