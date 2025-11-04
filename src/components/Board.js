import React from "react";
import Square from "./Square";
import "./Board.css";

export default function Board({ squares, onClick, winningLine }) {
  return (
    <div className="board">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onClick(i)}
          isWinner={winningLine?.includes(i)}
        />
      ))}
    </div>
  );
}
