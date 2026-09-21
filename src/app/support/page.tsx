"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ChevronLeft, Plus, MessageCircle } from "lucide-react";
import Swal from "sweetalert2";

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
        Swal.fire("Berhasil", "Tiket bantuan berhasil dibuat!", "success");
        setShowForm(false);
        setSubject("");
        setMessage("");
        mutate();
      } else {
        Swal.fire("Gagal", resData.error || "Gagal membuat tiket", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-[var(--color-primary)] font-medium flex items-center transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Kembali ke Dashboard
          </Link>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Plus size={16} /> Buat Tiket
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pusat Bantuan (Tiket)</h1>

        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Tiket Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Masalah</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Top up Rp50.000 belum masuk"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Pesan</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Jelaskan masalah Anda secara detail..."
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium">Batal</button>
                <button type="submit" disabled={submitting} className="btn-primary px-6 py-2 rounded-xl font-semibold disabled:opacity-50">
                  {submitting ? "Mengirim..." : "Kirim Tiket"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {(!data && !error) && <div className="p-8 text-center text-gray-500">Memuat tiket...</div>}
          {data?.tickets?.length === 0 && (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <MessageCircle size={48} className="text-gray-300 mb-3" />
              <div className="text-gray-500 font-medium">Belum ada tiket bantuan.</div>
            </div>
          )}
          <div className="divide-y divide-gray-100">
            {data?.tickets?.map((ticket: any) => (
              <Link 
                href={`/support/${ticket.id}`} 
                key={ticket.id}
                className="block p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900 text-lg">{ticket.subject}</div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                    ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ticket.status}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
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
