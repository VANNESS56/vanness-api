"use client";

import useSWR from "swr";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminTicketsPage() {
  const { data, error } = useSWR('/api/admin/tickets', fetcher, { refreshInterval: 5000 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {(!data && !error) && <div className="p-8 text-center text-gray-500">Memuat tiket...</div>}
        
        {data?.tickets?.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <MessageSquareText size={48} className="text-gray-300 mb-3" />
            <div className="text-gray-500 font-medium">Belum ada tiket bantuan.</div>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {data?.tickets?.map((ticket: any) => (
            <Link 
              href={`/ekhem/tickets/${ticket.id}`} 
              key={ticket.id}
              className="block p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900 text-lg mb-1">{ticket.subject}</div>
                  <div className="text-sm text-gray-600">Dari: <span className="font-medium text-gray-800">{ticket.user.username}</span> ({ticket.user.email})</div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                  ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {ticket.status}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Terakhir diupdate: {new Date(ticket.updatedAt).toLocaleString("id-ID")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
