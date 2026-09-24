"use client";

import Link from "next/link";
import { Info, Send, Code } from "lucide-react";
import ParticleNetwork from "@/components/ParticleNetwork";
import Sidebar from "@/components/Sidebar";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function AppInfoPage() {
  return (
    <div className="min-h-screen pb-24 text-gray-200 font-sans">

      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10 animate-fade-in-up">
        
        {/* Navbar */}
        <nav className="flex items-center gap-4 py-4 mb-4">
          <div className="relative">
            <Sidebar />
          </div>
          <div className="font-extrabold text-2xl tracking-wide text-white flex items-center gap-2">
            <AnimatedLogo /> Panness
          </div>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A1C23] rounded-xl flex items-center justify-center border border-[#262831]">
              <Info size={22} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">App Info & License</h1>
              <p className="text-xs text-gray-500 font-mono tracking-wider mt-1">System Information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#111215]/80 backdrop-blur-xl p-8 rounded-[1.5rem] shadow-2xl border border-[#1F2128]">
          <div className="flex items-center gap-4 mb-8 p-6 bg-[#17181D]/70 border border-[#262831] rounded-xl w-fit mx-auto shadow-inner">
            <div className="scale-125">
              <AnimatedLogo />
            </div>
            <div>
              <div className="text-white font-bold tracking-wide text-xl">Panness API</div>
              <div className="text-emerald-400 text-sm font-mono font-bold mt-1">Version 1.0.0</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#17181D]/40 border border-[#1F2128] p-6 rounded-2xl text-center flex flex-col justify-center">
              <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Developed By</div>
              <div className="text-2xl font-black text-white tracking-widest uppercase">
                Vanness
              </div>
            </div>
            
            <div className="bg-[#17181D]/40 border border-[#1F2128] p-6 rounded-2xl">
              <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Connect</div>
              <div className="flex flex-col gap-3">
                <a href="https://t.me/VannessWangsaff" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm font-mono font-bold text-gray-300 hover:text-white hover:border-blue-500/50 bg-[#0D0E11]/80 border border-[#262831] rounded-xl transition-all group shadow-md">
                  <Send size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  @VannessWangsaff
                </a>
                <a href="https://github.com/VANNESS56" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm font-mono font-bold text-gray-300 hover:text-white hover:border-gray-500 bg-[#0D0E11]/80 border border-[#262831] rounded-xl transition-all group shadow-md">
                  <Code size={18} className="text-gray-400 group-hover:scale-110 transition-transform" />
                  @VANNESS56
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-[#1F2128] text-center text-xs font-mono text-gray-600">
            &copy; 2026 Panness. All rights reserved. <br/>
            Licensed under the MIT License.
          </div>
        </div>
      </div>
    </div>
  );
}
