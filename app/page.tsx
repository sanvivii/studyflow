"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
  if (!email || !password) return alert("Enter email + password");
  setLoading(true);
  const { error } = await supabase.auth.signUp({ email, password });
  setLoading(false);

  if (error) return alert(error.message);
  alert("Signup successful. Now log in.");
}


  async function logIn() {
  if (!email || !password) return alert("Enter email + password");
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setLoading(false);

  if (error) return alert(error.message);
  window.location.href = "/dashboard";
}


  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">StudyFlow</h1>
        <p className="text-sm text-gray-600 mt-1">
          Login or create an account
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded-xl p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-xl p-3 bg-black text-white"
            onClick={logIn}
            disabled={loading}
          >
            {loading ? "..." : "Log In"}
          </button>

          <button
            className="w-full rounded-xl p-3 border"
            onClick={signUp}
            disabled={loading}
          >
            {loading ? "..." : "Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
}
