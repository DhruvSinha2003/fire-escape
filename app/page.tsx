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
  const messagesEndRef = useRef(null);

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
    }/5.

Previous events:
${messages
  .map((m) => (m.type === "bot" ? "AI: " + m.content : "Player: " + m.content))
  .join("\n")}

Player's action: ${userInput}

Respond with a short, vivid description of what happens (2-3 sentences). Keep the tension high. If the action is impossible or would result in immediate death, explain why and let them try something else without advancing the turn. If they successfully escape, congratulate them and end the game.`;

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
    if (!input.trim() || loading || turns >= 5) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await getResult(userMessage);
      const response = result.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { type: "bot", content: response }]);

      // Only increment turn if it wasn't an "impossible action" response
      if (!response.toLowerCase().includes("try something else")) {
        setTurns((prev) => prev + 1);
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
      <Turn turns={turns} />

      <div className="mt-4 bg-gray-800 p-4 rounded max-h-96 overflow-y-auto">
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

      {turns < 5 ? (
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
