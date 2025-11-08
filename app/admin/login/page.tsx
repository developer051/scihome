"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.replace("/admin/dashboard");
    }
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <h1 className="mb-6 text-center text-2xl font-semibold">Admin Login</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-1">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            required
          />
        </label>
        <label className="grid gap-1">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </section>
  );
}


