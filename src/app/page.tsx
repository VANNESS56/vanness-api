import Link from "next/link";
import Image from "next/image";
import { Code2, Headset, Zap, Layers, Shield, Wallet, KeyRound, ChevronRight, Terminal, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen text-gray-200 font-sans relative">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#08090C]/80 backdrop-blur-xl border-b border-[#1F2128]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Panness API Logo" width={150} height={50} className="h-10 w-auto object-contain brightness-110" priority />
          </Link>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-xl border border-[#1F2128] text-gray-300 hover:text-white hover:border-[#3B3E4C] hover:bg-[#111215]/60 transition-all font-medium backdrop-blur-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 transition-all font-bold"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center relative">
        {/* Subtle glow behind logo */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex justify-center mb-8 relative">
          <Image src="/logo.png" alt="Panness API Logo Utama" width={300} height={120} className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:scale-105 transition-transform duration-500" priority />
        </div>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-mono">
          Koleksi endpoint siap pakai untuk proyek bot, aplikasi, dan kebutuhanmu.
          Stabil, cepat, dan mudah diintegrasikan.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 transition-all text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <KeyRound size={16} />
            Register Sekarang
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#1F2128] text-gray-300 hover:text-white hover:border-[#3B3E4C] hover:bg-[#111215]/60 transition-all text-sm font-medium backdrop-blur-md"
          >
            <Layers size={16} />
            Dashboard
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[3px] h-6 bg-emerald-500 rounded-sm"></div>
          <h2 className="text-xl font-bold text-white tracking-wide">Kenapa Panness API?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Code2 size={20} className="text-blue-400" />,
              title: "Dokumentasi Lengkap",
              desc: "Panduan penggunaan API yang jelas dan mudah diikuti."
            },
            {
              icon: <Headset size={20} className="text-teal-400" />,
              title: "CS 24/7",
              desc: "Tim support siap membantu kapan saja via WhatsApp."
            },
            {
              icon: <Zap size={20} className="text-amber-400" />,
              title: "Cepat & Stabil",
              desc: "Endpoint dengan latensi rendah dan uptime tinggi."
            },
            {
              icon: <Layers size={20} className="text-emerald-400" />,
              title: "Banyak Fitur",
              desc: "Cek Nama, Stalker IG, Face Recognition, dan lainnya."
            },
            {
              icon: <Shield size={20} className="text-orange-400" />,
              title: "Aman",
              desc: "Rate limiting, validasi input, dan proteksi DDoS."
            },
            {
              icon: <Wallet size={20} className="text-pink-400" />,
              title: "Murah",
              desc: "Harga bersahabat mulai dari Rp 2.500 per token."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-2xl p-6 hover:border-[#3B3E4C] hover:shadow-2xl transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#17181D]/70 backdrop-blur-md flex items-center justify-center mb-4 border border-[#262831] group-hover:border-[#3B3E4C] transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-white mb-1.5 tracking-wide">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-[1.5rem] p-10 text-center shadow-2xl relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-white mb-3 tracking-wide relative">Mulai dalam 1 Menit</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto font-mono text-sm relative">
            Daftar, isi saldo token, lalu gunakan endpoint sesuai kebutuhanmu.
          </p>
          <div className="flex flex-wrap gap-3 justify-center relative">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-bold text-gray-900 transition-all shadow-lg shadow-emerald-500/20"
            >
              <KeyRound size={16} />
              Daftar & Ambil Token
            </Link>
            <Link
              href="/topup"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#1F2128] text-gray-300 hover:text-white hover:border-[#3B3E4C] hover:bg-[#17181D]/60 text-sm font-medium transition-all backdrop-blur-md"
            >
              <Wallet size={16} />
              Top Up Saldo
            </Link>
          </div>
        </div>
      </section>

      {/* Daftar Layanan */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[3px] h-6 bg-white rounded-sm"></div>
          <h2 className="text-xl font-bold text-white tracking-wide">Layanan yang Tersedia</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Cek Nama", cost: "3 Token" },
            { name: "Cek NIK", cost: "3 Token" },
            { name: "Cek NPWP", cost: "3 Token" },
            { name: "Cek KK", cost: "3 Token" },
            { name: "Cek No HP", cost: "3 Token" },
            { name: "Stalker IG", cost: "3 Token" },
            { name: "Stalker TikTok", cost: "3 Token" },
            { name: "Face Recognition", cost: "5 Token" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-xl p-4 text-center hover:border-[#3B3E4C] hover:shadow-xl transition-all group"
            >
              <div className="font-bold text-white text-sm mb-1 tracking-wide">{item.name}</div>
              <div className="text-emerald-500 text-xs font-mono font-semibold">{item.cost}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dokumentasi API */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

          <div className="flex items-center gap-3 mb-3">
            <Terminal size={22} className="text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Dokumentasi API</h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base mb-8 max-w-2xl leading-relaxed font-mono">
            Tidak hanya lewat Dashboard, Anda juga bisa menembak REST API kami secara langsung untuk diintegrasikan ke bot WhatsApp, aplikasi web, atau sistem Anda sendiri!
          </p>

          <div className="space-y-4">
            {/* Block 1 - Base URL */}
            <div className="rounded-xl overflow-hidden border border-[#1F2128]">
              <div className="bg-[#17181D]/70 backdrop-blur-md px-4 py-2.5 flex items-center border-b border-[#1F2128]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider font-mono">BASE URL</div>
              </div>
              <div className="bg-[#0D0E11] p-5">
                <code className="text-emerald-400 text-sm break-all font-mono font-medium">
                  https://(domain-anda.com)/api/v1/
                </code>
              </div>
            </div>

            {/* Block 2 - CURL */}
            <div className="rounded-xl overflow-hidden border border-[#1F2128]">
              <div className="bg-[#17181D]/70 backdrop-blur-md px-4 py-2.5 flex items-center border-b border-[#1F2128]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider font-mono">CURL - CEK NAMA</div>
              </div>
              <div className="bg-[#0D0E11] p-5 overflow-x-auto relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded font-mono">GET</div>
                <pre className="text-cyan-300 text-[13px] font-mono whitespace-pre-wrap leading-relaxed mt-2">
{`curl -X GET "https://.../api/v1/cek_nama?nama=Budi&apikey=YOUR_API_KEY"`}
                </pre>
              </div>
            </div>

            {/* Block 3 - Response */}
            <div className="rounded-xl overflow-hidden border border-[#1F2128]">
              <div className="bg-[#17181D]/70 backdrop-blur-md px-4 py-2.5 flex items-center border-b border-[#1F2128]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider font-mono">RESPONSE (JSON)</div>
              </div>
              <div className="bg-[#0D0E11] p-5 overflow-x-auto relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-mono">200 OK</div>
                <pre className="text-slate-300 text-[13px] font-mono whitespace-pre-wrap leading-relaxed mt-2">
{`{
  "creator": "PannessAPI",
  "status": true,
  "data": { ...hasil_pencarian... },
  "tokens_deducted": 3,
  "tokens_remaining": 97
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
             <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <KeyRound size={16} />
              Dapatkan API Key Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* S&K */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#111215]/80 backdrop-blur-xl border border-[#1F2128] rounded-[1.5rem] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-[3px] h-5 bg-red-500 rounded-sm"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">Syarat & Ketentuan</h2>
          </div>
          <ul className="text-gray-500 text-sm space-y-3 leading-relaxed font-mono">
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              Dilarang melakukan spam atau flood request ke server API.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              Dilarang menyebarluaskan akun atau token milik Anda kepada pihak lain.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              Segala bentuk penyalahgunaan data hasil API bukan tanggung jawab PannessAPI.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              Admin berhak memblokir akun yang melanggar ketentuan tanpa pemberitahuan.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 shrink-0">•</span>
              Dengan mendaftar, Anda dianggap telah menyetujui seluruh syarat di atas.
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F2128] mt-10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center text-sm text-gray-600 font-mono">
          <span>© 2026 PannessAPI</span>
          <a
            href="https://instagram.com/pannesscoyy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-500 transition-colors"
          >
            Instagram @pannesscoyy
          </a>
        </div>
      </footer>
    </div>
  );
}
