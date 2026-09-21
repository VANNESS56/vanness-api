"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Selamat Datang</h1>
          <p className="text-gray-600">Silakan login ke akun Panness Anda</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="input-glass w-full px-4 py-2.5 rounded-xl"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="input-glass w-full px-4 py-2.5 rounded-xl"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl mt-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[var(--color-primary)] hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
