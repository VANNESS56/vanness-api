"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, KeyRound, Mail, Phone, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import ParticleNetwork from "@/components/ParticleNetwork";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-4 relative">


      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in-up">
        {/* Card */}
        <div className="bg-[#111215]/90 backdrop-blur-md border border-[#1F2128] rounded-[1.5rem] shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>

          <div className="p-8">
            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors tracking-wider uppercase mb-8 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              RETURN TO BASE
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white tracking-wider uppercase mb-2">
                Create Account
              </h1>
              <div className="w-8 h-[3px] bg-blue-500 rounded-full mb-3"></div>
              <p className="text-gray-500 text-sm font-mono">
                Register to unlock all endpoints.
              </p>
            </div>

            {/* Clock banner */}
            <div className="bg-[#0D0E11] border border-[#1F2128] rounded-xl p-6 mb-8 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-blue-400 tracking-[0.2em] relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                {time || "00:00:00"}
              </div>
              <div className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase mt-2 relative z-10">
                System Time
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl mb-6 text-xs font-mono flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse"></div>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold tracking-[0.15em] text-gray-400 mb-2 uppercase">
                  Username ID
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10 pointer-events-none" />
                  <input
                    name="username"
                    type="text"
                    required
                    className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    placeholder="Ex: pannessuser"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold tracking-[0.15em] text-gray-400 mb-2 uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold tracking-[0.15em] text-gray-400 mb-2 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10 pointer-events-none" />
                  <input
                    name="phoneNumber"
                    type="text"
                    required
                    className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    placeholder="628123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold tracking-[0.15em] text-gray-400 mb-2 uppercase">
                  Security Key
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 z-10 pointer-events-none" />
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-black font-mono py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wider uppercase mt-2 shadow-lg shadow-white/5"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    CREATE ACCOUNT
                    <UserPlus size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-xs font-mono mb-3">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
                  Login
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono">
                <ShieldCheck size={12} className="text-blue-500/50" />
                Secure Connection · PannessAPI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
