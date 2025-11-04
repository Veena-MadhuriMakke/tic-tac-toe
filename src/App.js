import React, { useState } from "react";
import Board from "./components/Board";
import "./App.css";

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[step];
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo?.winner;

  const handleClick = (i) => {
    const newHistory = history.slice(0, step + 1);
    const squares = [...currentSquares];
    if (squares[i] || winner) return;
    squares[i] = xIsNext ? "X" : "O";
    setHistory([...newHistory, squares]);
    setStep(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (move) => setStep(move);

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <Board
        squares={currentSquares}
        onClick={handleClick}
        winningLine={winnerInfo?.line}
      />
      <div className="info">
        {winner ? (
          <h2>Winner: {winner}</h2>
        ) : (
          <h2>Next Player: {xIsNext ? "X" : "O"}</h2>
        )}
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <div className="history">
        <h3>Move History</h3>
        {history.map((_, move) => (
          <button key={move} onClick={() => jumpTo(move)}>
            {move === 0 ? "Go to start" : `Go to move #${move}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
