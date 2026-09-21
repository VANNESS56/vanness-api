"use client";

import { useState, useRef, useEffect, use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminTicketChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data, mutate, error } = useSWR(`/api/admin/tickets/${resolvedParams.id}`, fetcher, { refreshInterval: 5000 });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ticket = data?.ticket;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/admin/tickets/${resolvedParams.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        setMessage("");
        mutate();
      } else {
        const errData = await res.json();
        Swal.fire("Gagal", errData.error || "Gagal mengirim pesan", "error");
      }
    } catch (e) {
      Swal.fire("Error", "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    const result = await Swal.fire({
      title: 'Tutup Tiket?',
      text: "Anda yakin masalah ini sudah selesai?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tutup'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/tickets/${resolvedParams.id}`, { method: "PATCH" });
        if (res.ok) {
          mutate();
          Swal.fire("Berhasil", "Tiket ditutup", "success");
        }
      } catch (e) {
        Swal.fire("Error", "Gagal menutup tiket", "error");
      }
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">Gagal memuat tiket</div>;
  if (!ticket) return <div className="p-8 text-center text-gray-500">Memuat tiket...</div>;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 p-4 px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link href="/ekhem/tickets" className="p-2 -ml-2 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{ticket.subject}</h1>
            <div className="text-xs text-gray-500">
              User: <span className="font-medium text-[var(--color-primary)]">{ticket.user.username}</span> | 
              Tiket ID: {ticket.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {ticket.status === 'OPEN' && (
            <button 
              onClick={handleCloseTicket}
              className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
            >
              Tutup Tiket
            </button>
          )}
          <div className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {ticket.status === 'CLOSED' && <CheckCircle2 size={14} />}
            {ticket.status}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4 border-x border-gray-100">
        {ticket.messages.map((msg: any) => {
          const isAdmin = msg.senderRole === "ADMIN";
          return (
            <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                isAdmin ? "bg-gray-800 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
              }`}>
                {!isAdmin && <div className="text-xs font-bold text-[var(--color-primary)] mb-1">{ticket.user.username}</div>}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                <div className={`text-[10px] mt-2 text-right ${isAdmin ? "text-gray-400" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {ticket.status === 'CLOSED' && (
          <div className="text-center my-6">
            <span className="bg-gray-100 text-gray-500 text-xs px-4 py-1 rounded-full font-medium">
              Tiket ini telah ditutup
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={ticket.status === 'CLOSED' ? "Tiket sudah ditutup" : "Balas pesan user..."}
            disabled={ticket.status === 'CLOSED' || submitting}
            className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-gray-800 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={ticket.status === 'CLOSED' || !message.trim() || submitting}
            className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
