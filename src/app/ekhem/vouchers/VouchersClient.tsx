"use client";

import { useState } from "react";

export default function VouchersClient({ initialVouchers }: { initialVouchers: any[] }) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [code, setCode] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !tokenAmount) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          tokenAmount: parseInt(tokenAmount)
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess("Voucher berhasil dibuat!");
        setVouchers([data.voucher, ...vouchers]);
        setCode("");
        setTokenAmount("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(`PANNESS-${randomStr}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Kolom Kiri: Form Buat Voucher */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Voucher Baru</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">{success}</div>}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Voucher</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PANNESS-PROMO10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                required
              />
              <button 
                type="button"
                onClick={generateRandomCode}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Acak
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Token</label>
            <input 
              type="number" 
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="10"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !code || !tokenAmount}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Memproses..." : "Generate Voucher"}
          </button>
        </form>
      </div>

      {/* Kolom Kanan: Daftar Voucher */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Voucher</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm">
                <th className="py-3 px-4 font-medium">Kode</th>
                <th className="py-3 px-4 font-medium">Token</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-gray-900">{v.code}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {v.tokenAmount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {v.isUsed ? (
                      <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        Terpakai
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Tersedia
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(v.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada voucher yang dibuat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
