import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("Computer");
  const [namesEntered, setNamesEntered] = useState(false);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Check for winner
  useEffect(() => {
    const checkWinner = () => {
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
      for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinner(board[a]);
          return;
        }
      }
      if (!board.includes(null)) setWinner("draw");
    };
    checkWinner();
  }, [board]);

  // Computer move
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === "computer" && !xIsNext && !winner) {
      const emptyIndices = board
        .map((cell, i) => (cell === null ? i : null))
        .filter((i) => i !== null);
      const randomMove =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const timer = setTimeout(() => handleClick(randomMove), 700);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, mode, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
  };

  const startGame = () => {
    if (mode === "pvp" && player1.trim() && player2.trim()) {
      setNamesEntered(true);
    } else if (mode === "computer" && player1.trim()) {
      setNamesEntered(true);
    }
  };

  const currentPlayer = xIsNext ? player1 : player2;
  const winnerName =
    winner === "X" ? player1 : winner === "O" ? player2 : null;

  return (
    <div className="app">
      {winner && winner !== "draw" && <Confetti />}
      {!mode ? (
        <div className="mode-select">
          <h1>🎮 Tic Tac Toe</h1>
          <button
            className="mode-btn"
            onClick={() => setMode("pvp")}
          >
            👥 Player vs Player
          </button>
          <button
            className="mode-btn"
            onClick={() => setMode("computer")}
          >
            🤖 Player vs Computer
          </button>
        </div>
      ) : !namesEntered ? (
        <div className="start-screen">
          <h1>{mode === "pvp" ? "Enter Player Names" : "Enter Your Name"}</h1>
          <input
            type="text"
            placeholder="Enter Player 1 name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          {mode === "pvp" && (
            <input
              type="text"
              placeholder="Enter Player 2 name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
            />
          )}
          <button className="start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="game">
          <h1>
            {winner
              ? winner === "draw"
                ? "It's a Draw!"
                : `🎉 ${winnerName} Wins! 🎉`
              : `${currentPlayer}'s Turn (${xIsNext ? "X" : "O"})`}
          </h1>
          <div className="board">
            {board.map((cell, i) => (
              <button key={i} className="cell" onClick={() => handleClick(i)}>
                {cell}
              </button>
            ))}
          </div>
          <button className="reset-btn" onClick={resetGame}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
