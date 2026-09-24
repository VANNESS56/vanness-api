"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { LayoutGrid, Clock, Users, Search, MessageCircle, ChevronRight, Activity, Link2, CheckCircle2, Trophy, Copy, RefreshCw, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};
import AnimatedLogo from "@/components/AnimatedLogo";
import BottomNav from "@/components/BottomNav";
import ParticleNetwork from "@/components/ParticleNetwork";
import Sidebar from "@/components/Sidebar";
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
    refreshInterval: 3000,
    fallbackData: { tokenBalance: initialTokenBalance } 
  });
  
  const tokenBalance = userData?.tokenBalance ?? initialTokenBalance;

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
        mutate();
        Swal.fire('Berhasil!', 'API Key berhasil diperbarui!', 'success');
      }
    } catch (e) {
      Swal.fire('Gagal!', 'Gagal memperbarui API Key', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-24 text-gray-200">

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Navbar */}
        <motion.nav variants={itemVariants} className="flex items-center gap-4 py-4 mb-4">
          <div className="relative">
            <Sidebar />
          </div>
          <div className="font-extrabold text-2xl tracking-wide text-white">
            Panness API
          </div>
        </motion.nav>

        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="bg-[#111215]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] border border-[#1F2128] shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="44" height="44" className="text-white shrink-0">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              <div>
                <p className="text-xs text-gray-400 font-mono tracking-wider mb-1">Welcome back</p>
                <h1 className="text-xl font-bold text-white tracking-wide">{username}</h1>
              </div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md border-[2px] border-[#2A2D37] opacity-80">
              {username.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-4 rounded-xl">
              <div className="text-xs text-gray-400 font-mono mb-2">Total Users</div>
              <div className="flex items-center gap-3">
                <Users size={16} className="text-gray-200" />
                <span className="text-xl font-bold font-mono text-white">{metrics.totalUser.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-4 rounded-xl">
              <div className="text-xs text-gray-400 font-mono mb-2">Active Endpoints</div>
              <div className="flex items-center gap-3">
                <Link2 size={16} className="text-gray-200" />
                <span className="text-xl font-bold font-mono text-white">8</span>
              </div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-4 rounded-xl">
              <div className="text-xs text-gray-400 font-mono mb-2">Requests 24h</div>
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-gray-200" />
                <span className="text-xl font-bold font-mono text-white">{metrics.todayAllServer.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-4 rounded-xl">
              <div className="text-xs text-gray-400 font-mono mb-2">Completed 24h</div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-xl font-bold font-mono text-emerald-500">{metrics.todayUser.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Performance Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-5 bg-white rounded-sm"></div>
            <h2 className="text-lg font-bold text-white tracking-wide">Request Metrics</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-5 rounded-2xl">
              <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                 <Zap size={12} /> Today's Requests
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">{metrics.todayUser.toLocaleString('id-ID')}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono">
                <span className="text-white">{metrics.todayUser}</span> last 24h
              </div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-5 rounded-2xl">
              <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                 <Target size={12} /> Server Uptime
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">—</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono">10d 5h <span className="text-emerald-500">ok</span> / 0 fail</div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-5 rounded-2xl">
              <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                 <MessageCircle size={12} /> Total Sent
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">{metrics.totalUserRequests.toLocaleString('id-ID')}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono">requests delivered</div>
            </div>

            <div className="bg-[#17181D]/70 backdrop-blur-md border border-[#1F2128] p-5 rounded-2xl">
              <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                 <Trophy size={12} /> Leaderboard
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-2">—</div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono">Rank: <span className="text-emerald-500">{metrics.tier}</span></div>
            </div>
          </div>
        </motion.div>

        {/* Tools & Settings */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4 mt-8">
            <div className="w-[3px] h-5 bg-white rounded-sm"></div>
            <h2 className="text-lg font-bold text-white tracking-wide">Developer & Tools</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111215]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[1.5rem] border border-[#1F2128] shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">API Key & Saldo</h2>
                <div className="text-3xl font-bold font-mono text-emerald-500 mb-4">{tokenBalance} <span className="text-xs font-sans font-medium text-gray-500">Tokens</span></div>
                <div className="bg-[#17181D]/70 backdrop-blur-md px-4 py-3 rounded-lg text-xs font-mono text-gray-400 break-all border border-[#262831] mb-4">
                  {userData?.apiKey || "Memuat..."}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { 
                    navigator.clipboard.writeText(userData?.apiKey || ""); 
                    Swal.fire({ title: 'Tersalin!', text: 'API Key berhasil disalin', icon: 'success', timer: 1500, showConfirmButton: false, background: '#111215', color: '#fff' }); 
                  }}
                  className="bg-[#17181D]/70 backdrop-blur-md hover:bg-[#1F2128] text-white flex-1 py-2.5 rounded-lg text-xs font-mono transition-colors border border-[#262831] shadow-sm flex items-center justify-center gap-2"
                >
                  <Copy size={14} /> Copy
                </button>
                <button 
                  onClick={handleRegenerateKey}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 flex-1 py-2.5 rounded-lg text-xs font-mono transition-colors border border-red-500/20 shadow-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard/osint" className="group bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-2xl p-5 shadow-2xl hover:border-[#3B3E4C] transition-all flex-1">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#17181D]/70 backdrop-blur-md flex items-center justify-center shrink-0 border border-[#262831]">
                      <Search size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white tracking-wide">OSINT Tools</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">8 endpoint kependudukan</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/whatsapp-panel" className="group bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-2xl p-5 shadow-2xl hover:border-[#3B3E4C] transition-all flex-1">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#17181D]/70 backdrop-blur-md flex items-center justify-center shrink-0 border border-[#262831]">
                      <MessageCircle size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white tracking-wide">WhatsApp Panel</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">Kirim pesan langsung</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}
