"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Send, Wallet } from "lucide-react";
import ParticleNetwork from "@/components/ParticleNetwork";
import Sidebar from "@/components/Sidebar";

export default function TopupPage() {
  const router = useRouter();
  const [tokenAmount, setTokenAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrisData, setQrisData] = useState<{
    qr_string: string;
    amount: number;
    order_id: string;
  } | null>(null);

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState({ type: "", text: "" });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: userData } = useSWR('/api/user/me', fetcher, { refreshInterval: 3000 });

  useEffect(() => {
    if (qrisData && userData?.transactions) {
      const tx = userData.transactions.find((t: any) => t.orderId === qrisData.order_id);
      if (tx && tx.status === "SUCCESS") {
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    }
  }, [userData, qrisData, router]);

  const pricePerToken = 2500;
  const totalPrice = tokenAmount ? Number(tokenAmount) * pricePerToken : 0;

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAmount || Number(tokenAmount) < 5) {
      setError("Minimal pembelian adalah 5 token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAmount: Number(tokenAmount) })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat transaksi");
      } else {
        setQrisData({
          qr_string: data.payment.payment_number,
          amount: data.payment.total_payment,
          order_id: data.payment.order_id,
        });
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode) return;
    setVoucherLoading(true);
    setVoucherMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/vouchers/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setVoucherMsg({ type: "success", text: data.message });
        setVoucherCode("");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      } else {
        setVoucherMsg({ type: "error", text: data.error });
      }
    } catch (err) {
      setVoucherMsg({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setVoucherLoading(false);
    }
  };

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
            <Wallet size={22} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Deposit & Topup</h1>
            <p className="text-xs text-gray-500 font-mono tracking-wider mt-1">Isi saldo token untuk akses API</p>
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto">
          {!qrisData ? (
            <div className="bg-[#111215]/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-[#1F2128] overflow-hidden mb-6">
              <div className="bg-[#17181D]/70 border-b border-[#1F2128] px-6 py-4 flex items-center text-white">
                <span className="font-semibold text-[15px] tracking-wide">Form Deposit (QRIS)</span>
              </div>
              <form onSubmit={handleTopup} className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-[14px] text-gray-400 font-mono tracking-wider mb-2">Jumlah Token</label>
                  <input 
                    type="number" 
                    required
                    min="5"
                    step="1"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Minimal 5 Token"
                    className="w-full bg-[#08090C] border border-[#1F2128] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 placeholder-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-gray-400 font-mono tracking-wider mb-2">Total Pembayaran</label>
                  <input 
                    type="text" 
                    readOnly
                    value={totalPrice > 0 ? `Rp ${totalPrice.toLocaleString("id-ID")}` : ""}
                    className="w-full bg-[#1A1C23] border border-[#262831] rounded-xl px-4 py-3 text-emerald-500 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !tokenAmount || Number(tokenAmount) < 5}
                    className="w-full flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 px-6 py-3 rounded-xl text-[15px] font-bold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Memproses..." : <><Send size={18} className="mr-2" /> Buat Permintaan</>}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#111215]/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-[#1F2128] p-8 text-center space-y-6">
              <h2 className="text-xl font-bold text-white tracking-wide">
                {paymentSuccess ? "Pembayaran Berhasil! 🎉" : "Scan QRIS"}
              </h2>
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg relative">
                {paymentSuccess && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col justify-center items-center rounded-2xl z-10 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mb-2 shadow-lg">✓</div>
                    <div className="font-bold text-emerald-600 tracking-wide">Lunas</div>
                  </div>
                )}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrisData.qr_string)}`}
                  alt="QRIS Code"
                  width={250}
                  height={250}
                  className={`mx-auto rounded-lg ${paymentSuccess ? 'opacity-30' : ''}`}
                />
              </div>
              <div>
                <div className="text-gray-500 text-sm font-mono">Order ID: {qrisData.order_id}</div>
                <div className="text-3xl font-bold mt-2 text-emerald-500 font-mono">
                  Rp {qrisData.amount.toLocaleString("id-ID")}
                </div>
                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                  {paymentSuccess 
                    ? "Saldo token Anda telah ditambahkan. Mengalihkan ke Dashboard..." 
                    : "Silakan scan kode QRIS menggunakan aplikasi m-banking atau e-wallet. Saldo bertambah otomatis secara realtime."}
                </p>
              </div>
              <button onClick={() => router.push("/dashboard")} className="inline-block mt-4 px-6 py-3 border border-[#262831] rounded-xl text-sm text-gray-400 font-semibold hover:bg-[#1A1C23] hover:text-white transition-colors w-full">
                Kembali ke Dashboard
              </button>
            </div>
          )}

          {/* Form Redeem Voucher */}
          {!qrisData && (
            <div className="bg-[#111215]/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-[#1F2128] overflow-hidden">
              <div className="bg-[#17181D]/70 border-b border-[#1F2128] px-6 py-4 flex items-center text-white">
                <span className="font-semibold text-[15px] tracking-wide">Redeem Voucher</span>
              </div>
              <form onSubmit={handleRedeemVoucher} className="p-6 space-y-4">
                {voucherMsg.text && (
                  <div className={`p-3 rounded-xl border text-sm ${voucherMsg.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                    {voucherMsg.text}
                  </div>
                )}
                <div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-[#08090C] border border-[#1F2128] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono uppercase tracking-widest"
                    />
                    <button
                      type="submit"
                      disabled={voucherLoading || !voucherCode}
                      className="bg-[#1A1C23] hover:bg-[#262831] border border-[#262831] text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      {voucherLoading ? "Cek..." : "Redeem"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
