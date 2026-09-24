"use client";

import { useState } from "react";
import useSWR from "swr";
import { MessageCircle, Send, Loader2, Clock, ChevronDown } from "lucide-react";
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const AndroidIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5515 0 .9997.4482.9997.9993.0004.5511-.4482.9997-.9997.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5515 0 .9997.4482.9997.9993 0 .5511-.4482.9997-.9997.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.022 3.503C15.5393 8.3582 13.8535 8 12 8s-3.5393.3582-5.1371.9497L4.841 5.4467a.4154.4154 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);
import BottomNav from "@/components/BottomNav";
import ParticleNetwork from "@/components/ParticleNetwork";
import AnimatedLogo from "@/components/AnimatedLogo";
import Sidebar from "@/components/Sidebar";
import Swal from "sweetalert2";

interface WhatsAppPanelClientProps {
  username: string;
  initialTokenBalance: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

type SendType = string;

export default function WhatsAppPanelClient({ username, initialTokenBalance }: WhatsAppPanelClientProps) {
  const { data: userData } = useSWR('/api/user/me', fetcher, {
    refreshInterval: 3000,
    fallbackData: { tokenBalance: initialTokenBalance }
  });

  const tokenBalance = userData?.tokenBalance ?? initialTokenBalance;

  const { data: configData } = useSWR('/api/admin/wa-options', fetcher);
  const options = configData?.options || [
    { id: "text", name: "Pesan Teks", mode: "pesanbiasa", icon: "FileText" },
    { id: "image", name: "Pesan Gambar", mode: "pesandokumen", icon: "Clock" }
  ];

  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendType, setSendType] = useState<SendType>("text"); // will sync to options later

  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      Swal.fire("Error", "Nomor WhatsApp wajib diisi", "error");
      return;
    }



    setLoading(true);

    try {
      const selectedOpt = options.find((o: any) => o.id === sendType) || options[0];
      const payload: Record<string, string> = {
        phone: phoneNumber.replace(/\D/g, ""), // strip non-digits
        type: sendType,
        mode: selectedOpt?.mode || "pesanbiasa"
      };

      const res = await fetch("/api/external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "wa-send",
          params: payload
        })
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Gagal", data.error || "Gagal mengirim pesan", "error");
      } else {
        Swal.fire({
          title: "Berhasil!",
          text: "Bug WhatsApp berhasil dikirim",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan jaringan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-gray-200 font-sans">

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl mx-auto p-4 sm:p-6 relative z-10">

        {/* Navbar */}
        <motion.nav variants={itemVariants} className="flex items-center gap-4 py-4 mb-4">
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
        </motion.nav>

        {/* Page Title */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
          <div className="w-[3px] h-6 bg-white rounded-sm"></div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">WhatsApp Bug Panel</h1>
            <p className="text-gray-500 text-xs font-mono mt-1">Kirim Bug WhatsApp langsung dari dashboard</p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={itemVariants} className="bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-[1.5rem] shadow-2xl relative">
          {/* Top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-[1.5rem]"></div>

          <form onSubmit={handleSend} className="p-6 space-y-6 mt-2">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-mono font-bold tracking-wide text-gray-400 mb-2 uppercase">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm font-mono font-medium select-none z-10">
                  +62
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="81234567890"
                  className="bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white w-full pl-14 pr-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-2">Masukkan nomor tanpa awalan 0 atau +62</p>
            </div>

            {/* Send Type Dropdown */}
            <div className="relative">
              <label className="block text-xs font-mono font-bold tracking-wide text-gray-400 mb-2 uppercase">
                Tipe Pengiriman
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-[#17181D]/70 backdrop-blur-md border border-[#262831] text-white px-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const sel = options.find((o: any) => o.id === sendType) || options[0];
                      return sel?.icon === "Clock" ? <Clock size={16} className="text-emerald-500" /> : <AndroidIcon size={16} className="text-emerald-500" />;
                    })()}
                    <span className="font-bold">{options.find((o: any) => o.id === sendType)?.name || "Pesan"}</span>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute z-50 w-full mt-2 bg-[#1A1C23] border border-[#262831] rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                      {options.map((opt: any) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setSendType(opt.id); setIsDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-mono text-left transition-colors ${sendType === opt.id ? "bg-emerald-500/10 text-emerald-500 font-bold" : "text-gray-300 hover:bg-[#262831] hover:text-white"}`}
                        >
                          {opt.icon === "Clock" ? <Clock size={16} /> : <AndroidIcon size={16} />}
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>



            {/* Send Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold font-mono py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} />
                  SEND BUG
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>

    </div>
  );
}
