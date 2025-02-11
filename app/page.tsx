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
      content:
        "You wake up to the smell of smoke. The room is getting hot and dark. You need to escape within 5 turns. What do you do?",
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
    const context = `You are the game master in a tense survival scenario. The player is trapped in a burning house and must escape within 5 turns. Current turn: ${
      turns + 1
    }/5. Remember all previous context and maintain consistency in the scenario.

Game State:
- Room Layout: A second-floor bedroom with a window, a door leading to the hallway, and various furniture
- Fire Status: The fire is spreading, making the situation increasingly dangerous
- Player Status: The player starts in the bedroom and must escape the house
- Current Turn: ${turns + 1} out of 5
- Previous Events: 
${messages
  .map((m) => (m.type === "bot" ? "AI: " + m.content : "Player: " + m.content))
  .join("\n")}

Player's action: ${userInput}

Response Guidelines:
1. Only use "try something else" if the action is completely impossible or suicidal. In these cases, you may also provide a hint and make sure that the phrase "try something else" is used
2. For risky or reckless actions, let them proceed but describe negative consequences
3. Keep descriptions vivid and tense (2-3 sentences)
4. Use "congratulations" only if they successfully escape. you have to include the word "congratulations" in the response. if the user leaves the room say this.
5. Maintain consistency with previous events and room layout
6. Consider smoke, heat, and fire spread in responses

Remember: Let players face consequences of poor choices rather than blocking them with "try something else". Only prevent absolutely impossible actions.`;

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
        content:
          "You wake up to the smell of smoke. The room is getting hot and dark. You need to escape within 5 turns. What do you do?",
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
            Turn not consumed - Try a different approach
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

        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 bg-opacity-90 text-center text-sm text-gray-400">
          {turns}/5 Turns Used
        </div>
      </div>

      {hasWon ? (
        <div className="mt-4">
          <div className="text-green-500 mb-2 text-center font-bold text-xl">
            You Win!
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
          <div className="text-red-500 mb-2">Game Over - Out of turns!</div>
          <button
            onClick={resetGame}
            className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FireEscapeGame;
