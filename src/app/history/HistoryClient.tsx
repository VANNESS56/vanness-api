"use client";

import { useState } from "react";
import useSWR from "swr";
import { ChevronRight, X, Search, CreditCard } from "lucide-react";
import ParticleNetwork from "@/components/ParticleNetwork";
import Sidebar from "@/components/Sidebar";
import ResultViewer from "@/components/ResultViewer";

interface HistoryClientProps {
  username: string;
  searchHistory: any[];
  transactions: any[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HistoryClient({ username, searchHistory: initialSearchHistory, transactions: initialTransactions }: HistoryClientProps) {
  const { data } = useSWR('/api/user/me', fetcher, {
    refreshInterval: 5000,
    fallbackData: { searchHistory: initialSearchHistory, transactions: initialTransactions }
  });

  const searchHistory = data?.searchHistory ?? initialSearchHistory;
  const transactions = data?.transactions ?? initialTransactions;

  const [activeTab, setActiveTab] = useState<"search" | "deposit">("search");
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#1A1C23] rounded-xl flex items-center justify-center border border-[#262831]">
            <Search size={22} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Data History</h1>
            <p className="text-xs text-gray-500 font-mono tracking-wider mt-1">Riwayat aktivitas & transaksi</p>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-[#111215]/80 backdrop-blur-xl rounded-[1.5rem] shadow-sm border border-[#1F2128] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1F2128] flex gap-6">
            <button 
              onClick={() => setActiveTab("search")}
              className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
                activeTab === "search" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              History Pencarian
            </button>
            <button 
              onClick={() => setActiveTab("deposit")}
              className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
                activeTab === "deposit" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              History Deposit
            </button>
          </div>

          <div className="p-6">
            {activeTab === "search" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1F2128] text-gray-500 text-sm">
                      <th className="py-3 px-4 font-medium">Layanan</th>
                      <th className="py-3 px-4 font-medium">Target / Query</th>
                      <th className="py-3 px-4 font-medium">Biaya</th>
                      <th className="py-3 px-4 font-medium">Waktu</th>
                      <th className="py-3 px-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchHistory.map((item: any) => (
                      <tr key={item.id} className="border-b border-[#1F2128] hover:bg-[#17181D]">
                        <td className="py-3 px-4 text-white font-medium">
                          {item.endpointUsed}
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-sm max-w-xs truncate">
                          {item.query}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-semibold border border-blue-500/20">
                            -{item.costTokens} Token
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(item.createdAt).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => setSelectedResult(item.result || "Hasil pencarian tidak tersimpan untuk riwayat lama ini.")}
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                            title="Lihat Detail Hasil"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {searchHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Belum ada riwayat pencarian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "deposit" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1F2128] text-gray-500 text-sm">
                      <th className="py-3 px-4 font-medium">Order ID</th>
                      <th className="py-3 px-4 font-medium">Total Harga</th>
                      <th className="py-3 px-4 font-medium">Token Diterima</th>
                      <th className="py-3 px-4 font-medium">Metode</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((item: any) => {
                      const isExpired = item.status === 'PENDING' && (new Date().getTime() - new Date(item.createdAt).getTime()) > 5 * 60 * 1000;
                      const displayStatus = isExpired ? 'EXPIRED' : item.status === 'COMPLETED' ? 'SUCCESS' : item.status;

                      return (
                      <tr key={item.id} className="border-b border-[#1F2128] hover:bg-[#17181D]">
                        <td className="py-3 px-4 text-white font-mono text-sm">
                          {item.orderId}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          Rp {item.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-medium">
                          +{item.tokenAmount}
                        </td>
                        <td className="py-3 px-4 text-gray-500 uppercase text-xs font-semibold">
                          {item.paymentMethod}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            displayStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            displayStatus === 'FAILED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            displayStatus === 'EXPIRED' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString("id-ID")}
                        </td>
                      </tr>
                      );
                    })}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Belum ada riwayat deposit
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Result */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in-up">
          <div className="bg-[#111215] border border-[#1F2128] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#1F2128]">
              <h3 className="font-bold text-white tracking-wide">Detail Hasil Pencarian</h3>
              <button 
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-white transition-colors p-1 bg-[#17181D] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-auto bg-[#08090C] flex-1 rounded-b-2xl">
              <ResultViewer data={
                (() => {
                  if (selectedResult === "Hasil pencarian tidak tersimpan untuk riwayat lama ini.") {
                    return selectedResult;
                  }
                  try {
                    return typeof selectedResult === 'string' ? JSON.parse(selectedResult) : selectedResult;
                  } catch (e) {
                    return selectedResult;
                  }
                })()
              } />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
