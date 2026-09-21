"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";

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
        // Reload page to update balance in navbar/dashboard if needed, or just show success
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f4f6f9]">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Kembali ke Dashboard
          </Link>
          <div className="flex gap-4">
            <Link href="/history" className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center">
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Hist</span>
            </Link>
            <Link href="/support" className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center">
              <span className="hidden sm:inline">Support</span>
              <span className="sm:hidden">Bantuan</span>
            </Link>
          </div>
        </div>

        {!qrisData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Form */}
            <div className="bg-[#f8f9fa] border-b border-gray-200 px-6 py-4 flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-semibold text-[15px]">Form Deposit</span>
            </div>

            {/* Body Form */}
            <form onSubmit={handleTopup} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Jenis Pembayaran */}
              <div>
                <label className="block text-[14px] text-gray-600 mb-1.5">Jenis Pembayaran</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 bg-white">
                  <option>QRIS</option>
                </select>
              </div>

              {/* Jumlah Token */}
              <div>
                <label className="block text-[14px] text-gray-600 mb-1.5">Jumlah Token</label>
                <input 
                  type="number" 
                  required
                  min="5"
                  step="1"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="5"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                />
                <p className="text-[#f05050] text-[12px] mt-1">Minimal: 5 Token</p>
              </div>

              {/* Total Harga (Rupiah) */}
              <div>
                <label className="block text-[14px] text-gray-600 mb-1.5">Total Pembayaran</label>
                <input 
                  type="text" 
                  readOnly
                  value={totalPrice > 0 ? `Rp ${totalPrice.toLocaleString("id-ID")}` : ""}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-gray-700 bg-gray-50 focus:outline-none cursor-not-allowed font-semibold text-blue-600"
                />
              </div>

              {/* Button Submit */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={loading || !tokenAmount || Number(tokenAmount) < 5}
                  className="inline-flex items-center justify-center bg-[#5d5feF] hover:bg-[#4d4fdF] text-white px-6 py-2 rounded text-[14px] font-medium transition-colors disabled:opacity-50 min-w-[200px]"
                >
                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Buat Permintaan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              {paymentSuccess ? "Pembayaran Berhasil! 🎉" : "Scan QRIS"}
            </h2>
            <div className="bg-white border p-4 rounded-xl inline-block shadow-sm relative">
              {paymentSuccess && (
                <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center rounded-xl z-10 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mb-2 shadow-lg">✓</div>
                  <div className="font-bold text-green-600">Lunas</div>
                </div>
              )}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrisData.qr_string)}`}
                alt="QRIS Code"
                width={250}
                height={250}
                className={`mx-auto ${paymentSuccess ? 'opacity-30' : ''}`}
              />
            </div>
            
            <div>
              <div className="text-gray-500 text-sm">Order ID: {qrisData.order_id}</div>
              <div className="text-2xl font-bold mt-2 text-[#5d5feF]">
                Rp {qrisData.amount.toLocaleString("id-ID")}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {paymentSuccess 
                  ? "Saldo token Anda telah ditambahkan. Mengalihkan ke Dashboard..." 
                  : "Silakan scan kode QRIS di atas menggunakan aplikasi m-banking atau e-wallet Anda. Saldo akan bertambah otomatis setelah pembayaran berhasil (Realtime)."}
              </p>
            </div>

            <Link href="/dashboard" className="inline-block mt-4 px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Tutup dan Cek Saldo
            </Link>
          </div>
        )}

        {/* Form Redeem Voucher */}
        {!qrisData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#f8f9fa] border-b border-gray-200 px-6 py-4 flex items-center text-gray-700">
              <span className="font-semibold text-[15px]">Redeem Voucher</span>
            </div>
            <form onSubmit={handleRedeemVoucher} className="p-6 space-y-4">
              {voucherMsg.text && (
                <div className={`p-3 rounded text-sm ${voucherMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {voucherMsg.text}
                </div>
              )}
              <div>
                <label className="block text-[14px] text-gray-600 mb-1.5">Kode Voucher</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode voucher..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={voucherLoading || !voucherCode}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-[14px] font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
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
  );
}
