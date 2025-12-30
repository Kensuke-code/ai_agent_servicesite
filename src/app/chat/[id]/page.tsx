"use client";

import { useState } from "react";

type Prop = {
  params: { id: string };
};

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

export default function ChatPage({ params }: Prop) {
  const { id } = params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-semibold text-black dark:text-zinc-50">
            Chat {id}
          </h1>

          {/* メッセージ表示エリア */}
          <div className="mb-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                メッセージがありません。メッセージを入力してください。
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900"
                >
                  <div className="flex-shrink-0">
                    <img
                      src="/chat-icon-human.png"
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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