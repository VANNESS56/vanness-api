"use client";

import { useEffect, useState } from "react";
import DisableDevtool from "disable-devtool";
import { AlertOctagon, Home } from "lucide-react";

export default function DevToolsBlocker() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      DisableDevtool({
        ondevtoolopen: () => {
          setIsBlocked(true);
        },
        ondevtoolclose: () => {
          // Automaticaly unblock when devtools is closed
          setIsBlocked(false);
        },
      });
      
      // Manual fallback check for Eruda
      const erudaCheck = setInterval(() => {
        if ((window as any).eruda) {
          setIsBlocked(true);
        }
      }, 1000);

      return () => clearInterval(erudaCheck);
    }
  }, []);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#f8fafc] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 p-8 md:p-12 max-w-2xl w-full text-center flex flex-col items-center">
        
        <div className="w-16 h-16 bg-[#fee2e2] text-[#ef4444] rounded-2xl flex items-center justify-center mb-6">
          <AlertOctagon size={32} />
        </div>
        
        <h1 className="text-[32px] font-bold text-[#1e293b] mb-4">
          DevTools/Eruda Terdeteksi
        </h1>
        
        <p className="text-gray-500 text-[17px] mb-8">
          Tutup DevTools atau matikan Eruda lalu kembali ke beranda.
        </p>

        <button 
          onClick={() => window.location.href = "/"}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 mb-8 transition-colors shadow-sm"
        >
          <Home size={18} />
          Kembali ke /
        </button>

        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
          Jika anda berada pada halaman ini maka anda terdeteksi menggunakan dev tools/inspect.
        </p>
      </div>

      <p className="text-gray-400 text-[13px] mt-8 text-center max-w-2xl leading-relaxed px-4">
        Tip: Tutup semua panel Developer Tools (F12, Ctrl/⌘+Shift+I/J/C) atau copot Eruda, lalu tekan tombol di atas untuk kembali.
      </p>
    </div>
  );
}
