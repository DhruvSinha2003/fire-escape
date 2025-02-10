"use client";
import React, { useState } from "react";

const text = {
  F: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "██║     ", "╚═╝     "],
  I: ["██╗", "██║", "██║", "██║", "██║", "╚═╝"],
  R: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║  ██║", "╚═╝  ╚═╝"],
  E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗", "╚══════╝"],
  S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
  C: [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"],
  A: ["█████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  P: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔═══╝ ", "██║     ", "╚═╝     "],
  Space: ["  ", "  ", "  ", "  ", "  ", "  "],
};

const TextDisplay = () => {
  const [turns, setTurns] = useState(0);

  const increaseTurns = () => {
    setTurns((prevTurns) => (prevTurns < 5 ? prevTurns + 1 : prevTurns));
  };

  const word = ["F", "I", "R", "E", "Space", "E", "S", "C", "A", "P", "E"];

  return (
    <div className="font-mono whitespace-pre">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            {word.map((letter, j) => (
              <span
                key={j}
                style={{
                  color: j < turns * 2 + 1 ? "orange" : "white",
                }}
              >
                {text[letter as keyof typeof text][i]}
                {j < word.length - 1 && " "}
              </span>
            ))}
          </div>
        ))}
      <h1>{turns}</h1>
      <button onClick={increaseTurns}>Increase</button>
    </div>
  );
};

export default TextDisplay;
