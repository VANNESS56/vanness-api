"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Menu, LayoutGrid, Clock, Users, Loader2 } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import ResultViewer from "@/components/ResultViewer";
import Swal from "sweetalert2";

interface DashboardClientProps {
  username: string;
  initialTokenBalance: number;
  metrics: {
    totalUser: number;
    todayAllServer: number;
    todayUser: number;
    totalUserRequests: number;
    tier: string;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardClient({ username, initialTokenBalance, metrics }: DashboardClientProps) {
  const { data: userData, mutate } = useSWR('/api/user/me', fetcher, { 
    refreshInterval: 3000, // Update every 3 seconds
    fallbackData: { tokenBalance: initialTokenBalance } 
  });
  
  const tokenBalance = userData?.tokenBalance ?? initialTokenBalance;
  
  const [activeService, setActiveService] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    { id: "cek_nik", name: "Cek NIK KTP", desc: "Pencarian data kependudukan Dukcapil", cost: 3, param: "nik" },
    { id: "nikfoto", name: "Cek NIK + Foto KTP", desc: "Data Dukcapil lengkap beserta foto KTP", cost: 3, param: "nik" },
    { id: "cek_nama", name: "Cek Nama Dukcapil", desc: "Cari NIK dari nama lengkap", cost: 3, param: "nama" },
    { id: "nik2kk", name: "Cek NIK -> No. KK", desc: "Ambil No. KK dari sebuah NIK", cost: 3, param: "nik" },
    { id: "kk", name: "Cek Kartu Keluarga", desc: "Cek anggota keluarga dari No. KK", cost: 3, param: "nokk" },
    { id: "nopol", name: "Cek Plat Nomor", desc: "Cek data kendaraan dari Plat Nomor", cost: 3, param: "plat" },
    { id: "data-bocor", name: "Cek Data Bocor", desc: "Cek kebocoran email/nomor/NIK", cost: 3, param: "q" },
    { id: "fr", name: "Face Recognition", desc: "Cocokkan foto wajah dengan NIK", cost: 5, param: "url" },
  ];

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
        // Hapus property token agar tidak tampil di UI JSON
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

  const handleRegenerateKey = async () => {
    const result = await Swal.fire({
      title: 'Regenerate API Key?',
      text: "API Key lama akan hangus dan aplikasi yang menggunakannya akan gagal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Ganti!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/user/regenerate-key", { method: "POST" });
      if (res.ok) {
        mutate(); // refresh data dari SWR
        Swal.fire('Berhasil!', 'API Key berhasil diperbarui!', 'success');
      }
    } catch (e) {
      Swal.fire('Gagal!', 'Gagal memperbarui API Key', 'error');
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <nav className="flex justify-between items-center mb-8 glass-panel p-4 rounded-2xl relative bg-white/80 z-10">
        <div className="font-bold text-xl text-[var(--color-primary)]">
          <AnimatedLogo />
        </div>
        <div className="flex items-center gap-4 text-gray-900">
          <div className="text-sm hidden sm:block">
            Halo, <span className="font-semibold">{username}</span>
          </div>
          
          {/* Hamburger Menu */}
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            >
              <Menu size={24} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                <Link 
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-[var(--color-primary)] bg-blue-50/50 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/topup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                >
                  Deposit
                </Link>
                <Link 
                  href="/history"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                >
                  History
                </Link>
                <Link 
                  href="/support"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                >
                  Support / Ticket
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* === TOP STATS CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Endpoint */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Endpoint</div>
            <div className="text-2xl font-bold text-gray-900">{services.length}</div>
            <div className="text-xs text-gray-400 mt-1">Available</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <LayoutGrid size={24} />
          </div>
        </div>

        {/* Server Uptime */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Server Uptime</div>
            <div className="text-2xl font-bold text-gray-900">10d 5h 3m</div>
            <div className="text-xs text-gray-400 mt-1">Since last restart</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        {/* Total User */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total User</div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalUser.toLocaleString('id-ID')}</div>
            <div className="text-xs text-gray-400 mt-1">Terdaftar</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* === REQUEST METRICS === */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="p-5 border-b border-gray-100 font-bold text-gray-800 text-lg">
          Request Metrics
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#eff5fd] p-6 rounded-xl flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">Today (All Server)</div>
              <div className="text-3xl font-bold text-blue-500">{metrics.todayAllServer.toLocaleString('id-ID')}</div>
            </div>
            
            <div className="bg-[#eef9f0] p-6 rounded-xl flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">Today (Kamu)</div>
              <div className="text-3xl font-bold text-emerald-500">{metrics.todayUser.toLocaleString('id-ID')}</div>
            </div>

            <div className="bg-[#fefaf0] p-6 rounded-xl flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">Total (Kamu)</div>
              <div className="text-3xl font-bold text-amber-500">{metrics.totalUserRequests.toLocaleString('id-ID')}</div>
            </div>

            <div className="bg-[#f3f4fa] p-6 rounded-xl flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">Rank / Tier</div>
              <div className="mt-1 bg-gray-600 text-white text-sm font-semibold px-4 py-1.5 rounded-md shadow-sm">
                {metrics.tier}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN WORKSPACE === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Saldo & Menu */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-gray-600 font-medium text-sm mb-2">Saldo Token</h2>
            <div className="text-4xl font-bold text-gray-900 mb-4">
              {tokenBalance} <span className="text-lg font-normal text-gray-600">Token</span>
            </div>
            <Link href="/topup" className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-center block">
              Isi Ulang (Top Up)
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-gray-600 font-medium text-sm mb-2">API Key Anda</h2>
            <div className="bg-gray-50 px-4 py-3 rounded-lg text-xs font-mono text-gray-800 break-all border border-gray-200 mb-4 select-all shadow-inner">
              {userData?.apiKey || "Memuat..."}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(userData?.apiKey || ""); 
                  Swal.fire({ title: 'Tersalin!', text: 'API Key berhasil disalin', icon: 'success', timer: 1500, showConfirmButton: false }); 
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-colors border border-gray-200"
              >
                Copy
              </button>
              <button 
                onClick={handleRegenerateKey}
                className="bg-red-50 hover:bg-red-100 text-red-600 flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-colors border border-red-100"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Layanan API</h2>
            <div className="space-y-3">
              {services.map(s => (
                <div 
                  key={s.id}
                  onClick={() => { setActiveService(s.id); setResult(null); setError(""); setQuery(""); }}
                  className={`border p-4 rounded-xl cursor-pointer transition-colors bg-white/50 ${
                    activeService === s.id 
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" 
                      : "border-[var(--color-panel-border)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-xs font-medium bg-green-500/10 text-green-700 px-2 py-1 rounded">
                      {s.cost} Token
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Area Kerja */}
        <div className="lg:col-span-2 space-y-6">
          {activeService ? (
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Mencari: {services.find(s => s.id === activeService)?.name}
              </h2>
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Masukkan ${services.find(s => s.id === activeService)?.param}...`}
                  required
                  className="input-glass flex-1 px-4 py-2.5 rounded-xl"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Cari"}
                </button>
              </form>

              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-gray-700">Hasil Pencarian:</h3>
                  <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                    <ResultViewer data={result} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed border-2 border-[var(--color-panel-border)]">
              <div className="text-gray-600 mb-2">👈 Pilih layanan di samping untuk memulai</div>
              <p className="text-sm text-gray-500">Pilih salah satu layanan pencarian data untuk mengecek informasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
