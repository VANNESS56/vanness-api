"use client";

import { useState, useRef, useEffect, use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TicketChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data, mutate, error } = useSWR(`/api/user/tickets/${resolvedParams.id}`, fetcher, { refreshInterval: 5000 });
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
      const res = await fetch(`/api/user/tickets/${resolvedParams.id}`, {
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

  if (error) return <div className="p-8 text-center text-red-500">Gagal memuat tiket</div>;
  if (!ticket) return <div className="p-8 text-center text-gray-500">Memuat tiket...</div>;

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 p-4 px-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <Link href="/support" className="p-2 -ml-2 text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">{ticket.subject}</h1>
              <div className="text-xs text-gray-500">Tiket ID: {ticket.id.slice(-8).toUpperCase()}</div>
            </div>
          </div>
          <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
            ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {ticket.status === 'CLOSED' && <CheckCircle2 size={14} />}
            {ticket.status}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4 border-x border-gray-100">
          {ticket.messages.map((msg: any) => {
            const isMe = msg.senderRole === "USER";
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  isMe ? "bg-[var(--color-primary)] text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}>
                  {!isMe && <div className="text-xs font-bold text-blue-600 mb-1">Admin</div>}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                  <div className={`text-[10px] mt-2 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          {ticket.status === 'CLOSED' && (
            <div className="text-center my-6">
              <span className="bg-gray-100 text-gray-500 text-xs px-4 py-1 rounded-full font-medium">
                Tiket ini telah ditutup oleh Admin
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
              placeholder={ticket.status === 'CLOSED' ? "Tiket sudah ditutup" : "Ketik pesan..."}
              disabled={ticket.status === 'CLOSED' || submitting}
              className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={ticket.status === 'CLOSED' || !message.trim() || submitting}
              className="bg-[var(--color-primary)] hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
