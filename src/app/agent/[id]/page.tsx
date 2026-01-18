"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Prop = {
  params: Promise<{ id: string }>;
};

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isBot: boolean;
}

/**
 * AIエージェントとのチャットページコンポーネント
 * @param params - URLパラメータ（エージェントIDを含むPromise）
 */
export default function ChatPage({ params }: Prop) {
  const [agentId, setAgentId] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // スタイル定義
  const styles = {
    botMessage: "text-zinc-700 dark:text-zinc-300 prose prose-sm max-w-none leading-relaxed space-y-3",
    userMessage: "text-zinc-700 dark:text-zinc-300 leading-relaxed text-right whitespace-pre-wrap",
    messageContainer: "flex-1 min-w-0",
    inputField: "flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
    submitButton: "rounded-md bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200",
  };

  // ReactMarkdownのコンポーネント設定
  const markdownComponents = {
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc ml-6 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal ml-6 space-y-1">{children}</ol>
    )
  };

  // URLパラメータからエージェントIDを取得
  useEffect(() => {
    params.then((resolvedParams) => {
      setAgentId(resolvedParams.id);
    });
  }, [params]);

  /**
   * チャットメッセージを追加する
   * @param message - 追加するメッセージオブジェクト
   */
  const addMessage = (message: Message) => {
    setChatMessages((prev) => [...prev, message]);
  };

  /**
   * ボットのメッセージを更新する
   * @param botMessageId - 更新するボットメッセージのID
   * @param text - 新しいテキスト内容
   */
  const updateBotMessage = (botMessageId: number, text: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => 
        msg.id === botMessageId ? { ...msg, text } : msg
      )
    );
  };

  /**
   * AIエージェントからのストリームレスポンスを処理する
   * @param botMessageId - レスポンスを表示するボットメッセージのID
   */
  const handleStreamResponse = async (botMessageId: number) => {
    try {
      const response = await fetch('/api/invocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * メッセージ送信フォームの送信を処理する
   * @param e - フォームイベント
   */
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

          {/* メッセージ履歴エリア */}
          <div className="mb-6 space-y-4">
            {chatMessages.length === 0 ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                メッセージを入力してください。
              </p>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 rounded-lg p-4 shadow-sm ${msg.isBot ? 'dark:bg-zinc-900' : ''}`}
                >
                  <div className={styles.messageContainer}>
                    {msg.isBot ? (
                      <div className={styles.botMessage}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className={styles.userMessage}>
                        {msg.text}
                      </p>
                    )}
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
              className={styles.inputField}
            />
            <button
              type="submit"
              className={styles.submitButton}
            >
              登録
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}