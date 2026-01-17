import { getUser } from '@/utils/supabase/actions'
import { signout } from '@/utils/supabase/actions'

interface WelcomeMessageProps {
  userName: string;
}

function WelcomeMessage({ userName }: WelcomeMessageProps) {
  const greeting = "AI Agentへようこそ。";
  const displayName = `${userName}さん`;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {greeting}
      </h1>
      <p className="text-2xl leading-8 text-zinc-700 dark:text-zinc-300">
        {displayName}
      </p>

      <button className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        onClick={signout}>Sign out</button>
    </div>
  );
}

export default async function Home() {
  const user = await getUser();
  
  const userName = user?.user_metadata?.first_name ;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center py-24 px-10 bg-white dark:bg-black">
        <WelcomeMessage userName={userName} />
      </main>
    </div>
  );
}