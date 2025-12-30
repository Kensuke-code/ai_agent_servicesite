"use client";
import { login, signup } from '@/utils/supabase/actions'

import { useState, FormEvent } from "react";
import FormField from "@/components/FormField";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md px-6 py-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8 text-black dark:text-zinc-50">
          Sign Up
        </h1>
        <form className="space-y-6">
          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
           formAction={login}>Log in</button>
          <button className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
           formAction={signup}>Sign up</button>
        </form>
      </main>
    </div>
  );
}
