import Link from "next/link";
import Image from "next/image";
import { Orbitron } from "next/font/google";
import { Code2, Headset, Zap, Layers, Shield, Wallet, KeyRound } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Panness API Logo" width={150} height={50} className="h-10 w-auto object-contain" priority />
          </Link>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Panness API Logo Utama" width={300} height={120} className="h-24 md:h-32 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" priority />
        </div>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Koleksi endpoint siap pakai untuk proyek bot, aplikasi, dan kebutuhanmu.
          Stabil, cepat, dan mudah diintegrasikan.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <KeyRound size={16} />
            Register Sekarang
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors text-sm font-medium"
          >
            <Layers size={16} />
            Dashboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Code2 size={22} className="text-white" />,
              color: "bg-slate-600",
              title: "Dokumentasi Lengkap",
              desc: "Panduan penggunaan API yang jelas dan mudah diikuti."
            },
            {
              icon: <Headset size={22} className="text-white" />,
              color: "bg-teal-500",
              title: "CS 24/7",
              desc: "Tim support siap membantu kapan saja via WhatsApp."
            },
            {
              icon: <Zap size={22} className="text-white" />,
              color: "bg-blue-500",
              title: "Cepat & Stabil",
              desc: "Endpoint dengan latensi rendah dan uptime tinggi."
            },
            {
              icon: <Layers size={22} className="text-white" />,
              color: "bg-emerald-500",
              title: "Banyak Fitur",
              desc: "Cek Nama, Stalker IG, Face Recognition, dan lainnya."
            },
            {
              icon: <Shield size={22} className="text-white" />,
              color: "bg-amber-500",
              title: "Aman",
              desc: "Rate limiting, validasi input, dan proteksi DDoS."
            },
            {
              icon: <Wallet size={22} className="text-white" />,
              color: "bg-pink-500",
              title: "Murah",
              desc: "Harga bersahabat mulai dari Rp 2.500 per token."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Mulai dalam 1 Menit</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Daftar, isi saldo token, lalu gunakan endpoint sesuai kebutuhanmu.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              <KeyRound size={16} />
              Daftar & Ambil Token
            </Link>
            <Link
              href="/topup"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-500 text-cyan-600 hover:bg-cyan-50 text-sm font-medium transition-colors"
            >
              <Wallet size={16} />
              Top Up Saldo
            </Link>
          </div>
        </div>
      </section>

      {/* Daftar Layanan */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Layanan yang Tersedia</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="font-medium text-gray-900 text-sm mb-1">{item.name}</div>
              <div className="text-emerald-600 text-xs font-semibold">{item.cost}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dokumentasi API */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Dokumentasi API Terbuka</h2>
          <p className="text-gray-500 text-sm md:text-base mb-8 max-w-2xl leading-relaxed">
            Tidak hanya lewat Dashboard, Anda juga bisa menembak REST API kami secara langsung untuk diintegrasikan ke bot WhatsApp, aplikasi web, atau sistem Anda sendiri!
          </p>

          <div className="space-y-5">
            {/* Block 1 */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="bg-gray-100 px-4 py-2 flex items-center border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider">BASE URL</div>
              </div>
              <div className="bg-[#1e1e1e] p-5">
                <code className="text-emerald-400 text-sm break-all font-mono font-medium">
                  https://(domain-anda.com)/api/v1/
                </code>
              </div>
            </div>

            {/* Block 2 */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="bg-gray-100 px-4 py-2 flex items-center border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider">CURL - CEK NAMA</div>
              </div>
              <div className="bg-[#1e1e1e] p-5 overflow-x-auto relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded">GET</div>
                <pre className="text-cyan-300 text-[13px] font-mono whitespace-pre-wrap leading-relaxed mt-2">
{`curl -X GET "https://.../api/v1/cek_nama?nama=Budi&apikey=YOUR_API_KEY"`}
                </pre>
              </div>
            </div>
            
            {/* Block 3 */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="bg-gray-100 px-4 py-2 flex items-center border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-[10px] font-bold text-gray-500 tracking-wider">RESPONSE (JSON)</div>
              </div>
              <div className="bg-[#1e1e1e] p-5 overflow-x-auto relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">200 OK</div>
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              <KeyRound size={16} />
              Dapatkan API Key Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* S&K */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Syarat & Ketentuan</h2>
          <ul className="text-gray-500 text-sm space-y-3 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Dilarang melakukan spam atau flood request ke server API.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Dilarang menyebarluaskan akun atau token milik Anda kepada pihak lain.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Segala bentuk penyalahgunaan data hasil API bukan tanggung jawab PannessAPI.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Admin berhak memblokir akun yang melanggar ketentuan tanpa pemberitahuan.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Dengan mendaftar, Anda dianggap telah menyetujui seluruh syarat di atas.
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center text-sm text-gray-400">
          <span>© 2026 PannessAPI</span>
          <a
            href="https://instagram.com/pannesscoyy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            Instagram @pannesscoyy
          </a>
        </div>
      </footer>
    </div>
  );
}
