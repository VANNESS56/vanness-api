"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, ChevronRight, X } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-[#f8fafc]">
      {/* Navbar with Hamburger Menu */}
      <nav className="flex justify-between items-center mb-8 glass-panel p-4 rounded-2xl relative bg-white/80">
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
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
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
                  className="block px-4 py-2 text-sm text-[var(--color-primary)] bg-blue-50/50 font-medium"
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex gap-6">
          <button 
            onClick={() => setActiveTab("search")}
            className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
              activeTab === "search" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            History Pencarian
          </button>
          <button 
            onClick={() => setActiveTab("deposit")}
            className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${
              activeTab === "deposit" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-gray-500 hover:text-gray-700"
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
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="py-3 px-4 font-medium">Layanan</th>
                    <th className="py-3 px-4 font-medium">Target / Query</th>
                    <th className="py-3 px-4 font-medium">Biaya</th>
                    <th className="py-3 px-4 font-medium">Waktu</th>
                    <th className="py-3 px-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {searchHistory.map((item: any) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {item.endpointUsed}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm max-w-xs truncate">
                        {item.query}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          -{item.costTokens} Token
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(item.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setSelectedResult(item.result || "Hasil pencarian tidak tersimpan untuk riwayat lama ini.")}
                          className="p-1 text-gray-400 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded transition-colors"
                          title="Lihat Detail Hasil"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {searchHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
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
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
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
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-900 font-mono text-sm">
                        {item.orderId}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        +{item.tokenAmount}
                      </td>
                      <td className="py-3 px-4 text-gray-500 uppercase text-xs font-semibold">
                        {item.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          displayStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                          displayStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                          displayStatus === 'EXPIRED' ? 'bg-gray-200 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
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
                      <td colSpan={6} className="py-8 text-center text-gray-400">
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

      {/* Modal Result */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Detail Hasil Pencarian</h3>
              <button 
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-auto bg-white flex-1 rounded-b-2xl">
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
