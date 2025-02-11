"use client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Turn from "./Turn";

const FireEscapeGame = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: `You wake up gasping for air in a smoke-filled bedroom. Flames dance at the edges of your vision. Through the haze, you see:

• A window with flames licking at the curtains
• A door blocked by a fallen bookshelf
• A weakened floor that groans beneath you
• An ornate safe with a numerical keypad
• A mysterious letter pinned to the wall, its edges curling in the heat
• A thick blanket on a nearby chair
• An open attic hatch above, though fire creeps upward
• A collapsible ladder under the bed, tangled in chains
• A child's half-burned drawing that looks suspiciously like blueprints

The smoke is thickening. Each choice matters. What's your first move?`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showTurnMessage, setShowTurnMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  async function getResult(userInput: string) {
    const context = `You are the game master in a deadly escape scenario. The player is trapped in a burning bedroom and must escape within 5 turns or perish. Current turn: ${
      turns + 1
    }/5.

Game State:
- Location: Second-floor bedroom rapidly filling with smoke
- Hazards: Active fire, structural damage, toxic smoke, height (second floor)
- Key Items: Window (with flames), blocked door, floor (weakening), safe (locked), letter, blanket, attic hatch, ladder (chained), child's drawing shows a secret way out of the room hidden behind the safe. safe can be moved using the ladder and chain somehow.
- Player Status: Conscious but in danger
- Prior Events:
${messages
  .map((m) =>
    m.type === "bot" ? "Scene: " + m.content : "Action: " + m.content
  )
  .join("\n")}

Player's action: ${userInput}

Response Guidelines:
1. For impossible/suicidal actions: Use phrase "try something else" and provide a subtle hint
2. For risky actions: Allow but describe realistic consequences (smoke inhalation, burns, etc.)
3. Keep responses vivid but concise (2-3 sentences maximum)
4. Use "Congratulations" only when player successfully escapes
5. Maintain consistency with previous events and room layout
6. Consider:
   - Smoke is getting thicker
   - Heat is intensifying
   - Structure is weakening
   - Time pressure is mounting
   - Items can be combined or used creatively
7. Reward creative thinking and clever solutions
8. Jumping straight to the solution is discouraged

Key Rules:
- Let players face consequences rather than blocking actions
- Only use "try something else" for truly impossible actions
- Each turn should increase tension
- Items can have multiple uses
- Reward clever thinking
- Stay consistent with established facts

Response Format:
- Describe immediate result of action
- Add sensory details
- Hint at mounting danger`;

    try {
      return await axios({
        method: "post",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        params: { key: API_KEY },
        headers: { "Content-Type": "application/json" },
        data: {
          contents: [{ parts: [{ text: context }] }],
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || (turns >= 5 && !hasWon)) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await getResult(userMessage);
      const response = result.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { type: "bot", content: response }]);

      if (response.toLowerCase().includes("congratulations")) {
        setHasWon(true);
      } else if (!response.toLowerCase().includes("try something else")) {
        setTurns((prev) => prev + 1);
      } else {
        setShowTurnMessage(true);
        setTimeout(() => setShowTurnMessage(false), 2000);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: "An error occurred. Please try again.",
        },
      ]);
    }
    setLoading(false);
  }

  const resetGame = () => {
    setTurns(0);
    setHasWon(false);
    setShowTurnMessage(false);
    setMessages([
      {
        type: "bot",
        content: `You wake up gasping for air in a smoke-filled bedroom. Flames dance at the edges of your vision. Through the haze, you see:

• A window with flames licking at the curtains
• A door blocked by a fallen bookshelf
• A weakened floor that groans beneath you
• An ornate safe with a numerical keypad
• A mysterious letter pinned to the wall, its edges curling in the heat
• A thick blanket on a nearby chair
• An open attic hatch above, though fire creeps upward
• A collapsible ladder under the bed, tangled in chains
• A child's half-burned drawing that looks suspiciously like a map

The smoke is thickening. Each choice matters. What's your first move?`,
      },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Turn turns={turns} hasWon={hasWon} />

      {showTurnMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-gray-300 px-6 py-3 rounded-lg shadow-lg">
            That won&apos;t work - Try a different approach
          </div>
        </div>
      )}

      <div className="mt-4 relative">
        <div
          className="bg-gray-800 p-4 rounded max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 #1F2937",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.type === "user"
                  ? "text-green-400 text-right"
                  : message.type === "error"
                  ? "text-red-400"
                  : "text-white"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 bg-opacity-90 text-center text-sm text-gray-400">
          {!showTurnMessage ? `${turns}/5 Turns Used` : "Try something else"}
        </div>
      </div>

      {hasWon ? (
        <div className="mt-4">
          <div className="text-green-500 mb-2 text-center font-bold text-2xl">
            You&apos;ve Escaped! You&apos;re Safe!
          </div>
          <button
            onClick={resetGame}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      ) : turns < 5 ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you do?"
            className="flex-1 resize-none rounded-lg border p-3 min-h-[50px] max-h-32 bg-gray-700 text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Act
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <div className="text-red-500 mb-2 text-center font-bold text-xl">
            The fire claims another victim...
          </div>
          <button
            onClick={resetGame}
            className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FireEscapeGame;
