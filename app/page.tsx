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

const nums = {
  0: [
    " ██████╗ ",
    "██╔═████╗",
    "██║██╔██║",
    "████╔╝██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  1: [" ██╗", "███║", "╚██║", " ██║", " ██║", " ╚═╝"],
  2: [
    " ██████╗ ",
    "██╔═══██╗",
    "     ██╔╝",
    "   ██╔╝  ",
    "  ██╔╝   ",
    "  ██████╗",
  ],
  3: [
    " ██████╗ ",
    "╚════██╗",
    " █████╔╝",
    " ╚═══██╗",
    " ██████╔╝",
    " ╚═════╝ ",
  ],
  4: [
    "   ██╗██╗ ",
    "  ███║██║ ",
    " ██╔██║██║ ",
    " ╚═╝██║╚═╝ ",
    "    ██║   ",
    "    ╚═╝   ",
  ],
  5: [
    " ██████╗ ",
    "██╔════╝ ",
    "██████╗  ",
    "╚════██╗ ",
    "██████╔╝ ",
    "╚═════╝  ",
  ],
};

const TextDisplay = () => {
  const [turns, setTurns] = useState(0);

  const increaseTurns = () => {
    setTurns((prevTurns) => (prevTurns < 5 ? prevTurns + 1 : prevTurns));
  };

  const word = ["F", "I", "R", "E", "Space", "E", "S", "C", "A", "P", "E"];
  const turn_count = [1, 2, 3, 4, 5];

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
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            {nums[turns + 1]?.map((line, j) => (
              <span
                key={j}
                style={{
                  color: "orange",
                }}
              >
                {line[i]}
                {j < nums[turns + 1].length - 1 && " "}
              </span>
            ))}
          </div>
        ))}
      <button
        onClick={
          turns == 5
            ? () => {
                setTurns(0);
              }
            : increaseTurns
        }
      >
        Increase
      </button>
    </div>
  );
};

export default TextDisplay;
