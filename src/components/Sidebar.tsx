"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, Wallet, History, LifeBuoy, LogOut, Code, Send, Info } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1 text-gray-300 hover:text-white transition-colors focus:outline-none"
      >
        <Menu size={28} />
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Sidebar Panel */}
          <div 
            className={`fixed top-0 left-0 h-full w-72 bg-[#08090C]/80 backdrop-blur-xl border-r border-[#1F2128] shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6 flex items-center justify-between border-b border-[#1F2128]">
              <div className="flex items-center gap-3 text-white font-extrabold text-xl tracking-wide">
                <AnimatedLogo />
                Panness
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Menu</div>
              
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-emerald-500 hover:bg-[#17181D]/70 backdrop-blur-md rounded-xl transition-all">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              
              <Link href="/topup" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-emerald-500 hover:bg-[#17181D]/70 backdrop-blur-md rounded-xl transition-all">
                <Wallet size={18} />
                Deposit
              </Link>
              
              <Link href="/history" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-emerald-500 hover:bg-[#17181D]/70 backdrop-blur-md rounded-xl transition-all">
                <History size={18} />
                History
              </Link>
              
              <Link href="/support" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-emerald-500 hover:bg-[#17181D]/70 backdrop-blur-md rounded-xl transition-all">
                <LifeBuoy size={18} />
                Support / Ticket
              </Link>

              <Link href="/app-info" onClick={() => setIsOpen(false)} className="mt-auto flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-emerald-500 hover:bg-[#17181D]/70 backdrop-blur-md rounded-xl transition-all">
                <Info size={18} />
                App Info & License
              </Link>
            </div>

            <div className="p-4 border-t border-[#1F2128]">
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

        </>,
        document.body
      )}
    </>
  );
}
