"use client";

import { useState, useEffect } from "react";

type Prop = {
  params: Promise<{ id: string }>;
};

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isBot: boolean;
}

export default function ChatPage({ params }: Prop) {
  const [agentId, setAgentId] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    params.then((resolvedParams) => {
      setAgentId(resolvedParams.id);
    });
  }, [params]);

  const addMessage = (message: Message) => {
    setChatMessages((prev) => [...prev, message]);
  };

  const updateBotMessage = (botMessageId: number, text: string) => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === botMessageId ? { ...msg, text } : msg
      )
    );
  };

  const handleStreamResponse = async (botMessageId: number) => {
    try {
      const response = await fetch('/api/invocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputMessage.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        updateBotMessage(botMessageId, accumulatedText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateBotMessage(botMessageId, `エラーが発生しました: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !agentId) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      timestamp: new Date(),
      isBot: false
    };

    addMessage(userMessage);
    setInputMessage("");

    const botMessageId = Date.now() + 1;
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      timestamp: new Date(),
      isBot: true
    };

    addMessage(botMessage);
    handleStreamResponse(botMessageId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-semibold text-black dark:text-zinc-50">
            Chat {agentId}
          </h1>

          {/* メッセージ表示エリア */}
          <div className="mb-6 space-y-4">
            {chatMessages.length === 0 ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                メッセージを入力してください。
              </p>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={msg.isBot ? "/chat-icon-bot.png" : "/chat-icon-human.png"}
                      alt="icon"
                      width={70}
                      height={70}
                      className="bg-transparent rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-700 dark:text-zinc-300">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 入力フォーム */}
      <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
            >
              登録
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}