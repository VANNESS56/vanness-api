"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, Search, Fingerprint, User, CreditCard, Users, ScanFace } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ParticleNetwork from "@/components/ParticleNetwork";
import AnimatedLogo from "@/components/AnimatedLogo";
import Sidebar from "@/components/Sidebar";
import ResultViewer from "@/components/ResultViewer";

interface OsintClientProps {
  username: string;
  initialTokenBalance: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const services = [
  { id: "cek_nik", name: "Cek NIK KTP", desc: "Pencarian data kependudukan Dukcapil", cost: 3, param: "nik", icon: Fingerprint, color: "bg-blue-500" },
  { id: "nikfoto", name: "Cek NIK + Foto KTP", desc: "Data Dukcapil lengkap beserta foto KTP", cost: 3, param: "nik", icon: ScanFace, color: "bg-indigo-500" },
  { id: "cek_nama", name: "Cek Nama Dukcapil", desc: "Cari NIK dari nama lengkap", cost: 3, param: "nama", icon: User, color: "bg-emerald-500" },
  { id: "nik2kk", name: "Cek NIK → No. KK", desc: "Ambil No. KK dari sebuah NIK", cost: 3, param: "nik", icon: CreditCard, color: "bg-amber-500" },
  { id: "kk", name: "Cek Kartu Keluarga", desc: "Cek anggota keluarga dari No. KK", cost: 3, param: "nokk", icon: Users, color: "bg-pink-500" },
  { id: "nopol", name: "Cek Plat Nomor", desc: "Cek data kendaraan dari Plat Nomor", cost: 3, param: "plat", icon: CreditCard, color: "bg-cyan-500" },
  { id: "data-bocor", name: "Cek Data Bocor", desc: "Cek kebocoran email/nomor/NIK", cost: 3, param: "q", icon: Search, color: "bg-red-500" },
  { id: "fr", name: "Face Recognition", desc: "Cocokkan foto wajah dengan NIK", cost: 5, param: "url", icon: ScanFace, color: "bg-violet-500" },
];

export default function OsintClient({ username, initialTokenBalance }: OsintClientProps) {
  const { data: userData, mutate } = useSWR('/api/user/me', fetcher, {
    refreshInterval: 3000,
    fallbackData: { tokenBalance: initialTokenBalance }
  });

  const tokenBalance = userData?.tokenBalance ?? initialTokenBalance;

  const [activeService, setActiveService] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService || !query) return;

    setLoading(true);
    setError("");
    setResult(null);

    const serviceDef = services.find(s => s.id === activeService);
    if (!serviceDef) return;

    try {
      const res = await fetch("/api/external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: activeService,
          params: { [serviceDef.param]: query }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengambil data");
      } else {
        const displayData = { ...data };
        delete displayData.tokens_deducted;
        delete displayData.tokens_remaining;

        setResult(displayData);
        if (data.tokens_deducted) {
          mutate({ tokenBalance: tokenBalance - data.tokens_deducted }, false);
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const activeDef = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen pb-24 text-gray-200 font-sans">

      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10 animate-fade-in-up">
        
        {/* Navbar */}
        <nav className="flex items-center gap-4 py-4 mb-4">
          <div className="relative">
            <Sidebar />
          </div>
          <div className="font-extrabold text-2xl tracking-wide text-white">
            Panness API
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/20">
              {tokenBalance} Token
            </div>
            <div className="text-xs font-mono text-gray-500 hidden sm:block">
              {username}
            </div>
          </div>
        </nav>

        {/* Page Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-[3px] h-6 bg-white rounded-sm"></div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">OSINT Tools</h1>
            <p className="text-gray-500 text-xs font-mono mt-1">Pencarian data kependudukan & intelijen sumber terbuka</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {services.map(s => {
            const Icon = s.icon;
            const isActive = activeService === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveService(s.id);
                  setResult(null);
                  setError("");
                  setQuery("");
                }}
                className={`relative p-4 rounded-2xl text-left transition-all border ${
                  isActive
                    ? "border-emerald-500 bg-[#17181D]/70 backdrop-blur-md shadow-md shadow-emerald-500/10"
                    : "border-[#1F2128] bg-[#111215]/80 backdrop-blur-xl hover:border-[#3B3E4C] hover:bg-[#17181D]/70 backdrop-blur-md"
                }`}
              >
                <div className={`${s.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-lg opacity-90`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="font-bold text-white text-sm leading-tight">{s.name}</div>
                <div className="text-[10px] text-emerald-500 font-mono font-semibold mt-1">{s.cost} Token</div>
              </button>
            );
          })}
        </div>

        {/* Search Area */}
        {activeService && activeDef ? (
          <div className="bg-[#111215]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] border border-[#1F2128] shadow-2xl">
            <h2 className="text-lg font-bold text-white tracking-wide mb-1">
              {activeDef.name}
            </h2>
            <p className="text-xs font-mono text-gray-500 mb-5">{activeDef.desc}</p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Masukkan ${activeDef.param}...`}
                required
                className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white px-4 py-3 rounded-xl flex-1 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-6 py-3 rounded-xl font-bold font-mono disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Search size={18} /> Cari</>}
              </button>
            </form>

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-mono">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Hasil Pencarian:</h3>
                <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] p-5 rounded-2xl shadow-inner">
                  <ResultViewer data={result} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#111215]/80 backdrop-blur-xl p-12 rounded-[1.5rem] flex flex-col items-center justify-center text-center min-h-[300px] border border-[#1F2128] border-dashed">
            <Search size={48} className="text-gray-700 mb-4" />
            <div className="text-gray-400 mb-2 font-bold tracking-wide">Pilih Layanan OSINT</div>
            <p className="text-xs font-mono text-gray-600">Pilih salah satu layanan di atas untuk memulai pencarian data.</p>
          </div>
        )}
      </div>

    </div>
  );
}
