export default function SignupConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-10 py-16 bg-white dark:bg-black rounded-lg shadow-lg">
        <p className="text-2xl leading-8 text-zinc-700 dark:text-zinc-300 text-center">
          本人確認のメールを送信しました。 <br />
          メールボックスを確認し、ユーザー登録を完了させてください。
        </p>
      </main>
    </div>
  );
}