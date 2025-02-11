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

const dash = [
  "            ",
  "            ",
  "   █████╗   ",
  "   ╚════╝   ",
  "            ",
  "            ",
];

const slash = [
  "        ██╗   ",
  "       ██╔╝   ",
  "      ██╔╝    ",
  "     ██╔╝     ",
  "    ██╔╝      ",
  "   ╚═╝        ",
];

const nums = {
  0: [
    " ██████╗ ",
    "██╔═████╗",
    "██║██╔██║",
    "████╔╝██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  1: [
    " ██╗     ",
    "███║     ",
    "╚██║     ",
    " ██║     ",
    " ██║     ",
    " ╚═╝     ",
  ],
  2: ["██████╗ ", "╚════██╗", " █████╔╝", "██╔═══╝ ", "███████╗", "╚══════╝"],
  3: ["██████╗ ", "╚════██╗", " █████╔╝", "╚════██╗", "██████╔╝", "╚═════╝ "],
  4: ["██╗  ██╗", "██║  ██║", "███████║", "╚════██║", "     ██║", "     ╚═╝"],
  5: ["██████╗ ", "██╔═══╝ ", "██████╗ ", "╚════██╗", "██████╔╝", "╚═════╝ "],
};

const Turn = () => {
  const [turns, setTurns] = useState(0);

  const increaseTurns = () => {
    setTurns((prevTurns) => (prevTurns < 5 ? prevTurns + 1 : prevTurns));
  };

  const word = ["F", "I", "R", "E", "Space", "E", "S", "C", "A", "P", "E"];

  return (
    <div className="font-mono whitespace-pre">
      <div className="flex">
        <div>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                {word.map((letter, j) => (
                  <span
                    key={j}
                    style={{
                      color:
                        turns === 5
                          ? "red"
                          : j < turns * 2 + 1
                          ? "orange"
                          : "white",
                    }}
                  >
                    {text[letter as keyof typeof text][i]}
                    {j < word.length - 1 && " "}
                  </span>
                ))}
              </div>
            ))}
        </div>

        <div>
          {dash.map((line, i) => (
            <div key={i} style={{ color: turns === 5 ? "red" : "white" }}>
              {line}
            </div>
          ))}
        </div>

        <div className="ml-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} style={{ color: turns === 5 ? "red" : "white" }}>
                {nums[turns as keyof typeof nums][i]}
              </div>
            ))}
        </div>

        <div>
          {slash.map((line, i) => (
            <div key={i} style={{ color: turns === 5 ? "red" : "white" }}>
              {line}
            </div>
          ))}
        </div>

        <div>
          {nums[5].map((line, i) => (
            <div key={i} style={{ color: turns === 5 ? "red" : "white" }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={turns === 5 ? () => setTurns(0) : increaseTurns}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        {turns === 5 ? "Reset" : "Increase"}
      </button>
    </div>
  );
};

export default Turn;
