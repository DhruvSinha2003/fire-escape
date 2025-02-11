import React from "react";

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

interface TurnProps {
  turns: number;
  hasWon: boolean;
}

const Turn: React.FC<TurnProps> = ({ turns, hasWon }) => {
  const word = ["F", "I", "R", "E", "Space", "E", "S", "C", "A", "P", "E"];

  const getColor = () => {
    if (hasWon) return "rgb(34, 197, 94)"; // text-green-500
    if (turns === 5) return "red";
    return "white";
  };

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
                      color: hasWon
                        ? "rgb(34, 197, 94)"
                        : turns === 5
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
            <div key={i} style={{ color: getColor() }}>
              {line}
            </div>
          ))}
        </div>

        <div className="ml-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} style={{ color: getColor() }}>
                {nums[turns as keyof typeof nums][i]}
              </div>
            ))}
        </div>

        <div>
          {slash.map((line, i) => (
            <div key={i} style={{ color: getColor() }}>
              {line}
            </div>
          ))}
        </div>

        <div>
          {nums[5].map((line, i) => (
            <div key={i} style={{ color: getColor() }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Turn;
