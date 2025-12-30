"use client";

import { useState, useMemo } from "react";

interface WelcomeMessageProps {
  userName: string;
}

function WelcomeMessage({ userName }: WelcomeMessageProps) {
  const greeting = useMemo(() => "AI Agentへようこそ。", []);
  const displayName = useMemo(() => `${userName}さん`, [userName]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {greeting}
      </h1>
      <p className="text-2xl leading-8 text-zinc-700 dark:text-zinc-300">
        {displayName}
      </p>
    </div>
  );
}

export default function Home() {
  // TODO: 認証システム実装後、ユーザー名を動的に取得する
  const [userName] = useState<string>("ゲスト");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <WelcomeMessage userName={userName} />
      </main>
    </div>
  );
}
