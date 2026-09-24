"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Plus, MessageCircle, LifeBuoy } from "lucide-react";
import Swal from "sweetalert2";
import ParticleNetwork from "@/components/ParticleNetwork";
import Sidebar from "@/components/Sidebar";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SupportPage() {
  const { data, mutate, error } = useSWR('/api/user/tickets', fetcher);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message })
      });
      const resData = await res.json();
      if (res.ok) {
        Swal.fire({ title: 'Berhasil', text: 'Tiket bantuan berhasil dibuat!', icon: 'success', background: '#111215', color: '#fff' });
        setShowForm(false);
        setSubject("");
        setMessage("");
        mutate();
      } else {
        Swal.fire({ title: 'Gagal', text: resData.error || "Gagal membuat tiket", icon: 'error', background: '#111215', color: '#fff' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Terjadi kesalahan', icon: 'error', background: '#111215', color: '#fff' });
    } finally {
      setSubmitting(false);
    }
  };

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
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A1C23] rounded-xl flex items-center justify-center border border-[#262831]">
              <LifeBuoy size={22} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Pusat Bantuan</h1>
              <p className="text-xs text-gray-500 font-mono tracking-wider mt-1">Sistem Tiket Support</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus size={16} /> Buat Tiket
          </button>
        </div>

        {showForm && (
          <div className="bg-[#111215]/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-2xl border border-[#1F2128] mb-6">
            <h2 className="text-lg font-bold text-white mb-4 tracking-wide">Tiket Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-mono tracking-wider text-gray-400 mb-2">Judul Masalah</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Top up Rp50.000 belum masuk"
                  className="w-full px-4 py-3 bg-[#08090C] border border-[#1F2128] rounded-xl focus:border-blue-500 outline-none text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-mono tracking-wider text-gray-400 mb-2">Detail Pesan</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Jelaskan masalah Anda secara detail..."
                  className="w-full px-4 py-3 bg-[#08090C] border border-[#1F2128] rounded-xl focus:border-blue-500 outline-none text-white h-32 transition-colors resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-gray-400 hover:bg-[#1A1C23] hover:text-white border border-transparent hover:border-[#262831] rounded-xl font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20">
                  {submitting ? "Mengirim..." : "Kirim Tiket"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#111215]/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-[#1F2128] overflow-hidden">
          {(!data && !error) && <div className="p-8 text-center text-gray-500 font-mono">Memuat tiket...</div>}
          {data?.tickets?.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#1A1C23] rounded-full flex items-center justify-center border border-[#262831] mb-4">
                <MessageCircle size={28} className="text-gray-500" />
              </div>
              <div className="text-gray-400 font-medium">Belum ada tiket bantuan.</div>
            </div>
          )}
          <div className="divide-y divide-[#1F2128]">
            {data?.tickets?.map((ticket: any) => (
              <Link 
                href={`/support/${ticket.id}`} 
                key={ticket.id}
                className="block p-5 hover:bg-[#17181D] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white text-lg tracking-wide">{ticket.subject}</div>
                  <div className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${
                    ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[#1A1C23] text-gray-400 border-[#262831]'
                  }`}>
                    {ticket.status}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono mt-2">
                  Diperbarui: {new Date(ticket.updatedAt).toLocaleString("id-ID")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
