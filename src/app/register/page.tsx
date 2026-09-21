"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phoneNumber,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Buat Akun</h1>
          <p className="text-gray-600">Daftar untuk menggunakan layanan Panness</p>
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
              placeholder="Username Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="input-glass w-full px-4 py-2.5 rounded-xl"
              placeholder="Email Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              No HP (Contoh: 628...)
            </label>
            <input
              name="phoneNumber"
              type="text"
              required
              className="input-glass w-full px-4 py-2.5 rounded-xl"
              placeholder="628123456789"
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
              minLength={6}
              className="input-glass w-full px-4 py-2.5 rounded-xl"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl mt-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
