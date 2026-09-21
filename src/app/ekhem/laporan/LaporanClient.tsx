"use client";
import { Printer } from "lucide-react";

export default function LaporanClient({ initialTransactions }: { initialTransactions: any[] }) {
  
  const handlePrint = () => {
    window.print();
  };

  const totalRevenue = initialTransactions
    .filter(t => t.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Header Print & Tampilan Layar */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-500 text-sm">Rekapitulasi seluruh transaksi Top Up saldo.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Printer size={20} />
          Cetak Laporan (PDF)
        </button>
      </div>

      {/* Header Khusus Print (Tersembunyi di layar normal) */}
      <div className="hidden print:block mb-8 text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan PannessAPI</h1>
        <p className="text-gray-600">Dicetak pada: {new Date().toLocaleString("id-ID")}</p>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 print:bg-white print:border-gray-300">
          <div className="text-sm text-gray-500 mb-1">Total Transaksi</div>
          <div className="text-2xl font-bold text-gray-900">{initialTransactions.length}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 print:bg-white print:border-gray-300">
          <div className="text-sm text-blue-600 mb-1">Total Pendapatan Bersih (Sukses)</div>
          <div className="text-2xl font-bold text-blue-900">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse print:text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4 font-bold">Order ID</th>
              <th className="py-3 px-4 font-bold">Pengguna</th>
              <th className="py-3 px-4 font-bold">Nominal</th>
              <th className="py-3 px-4 font-bold">Token</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {initialTransactions.map((t, idx) => (
              <tr key={t.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50/30' : ''} print:bg-transparent`}>
                <td className="py-3 px-4 font-mono text-xs">{t.orderId}</td>
                <td className="py-3 px-4 text-sm font-medium">{t.user.username}</td>
                <td className="py-3 px-4 text-sm font-medium">Rp {t.amount.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4 text-sm">+{t.tokenAmount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    t.status === 'COMPLETED' ? 'bg-green-100 text-green-700 print:border print:border-green-500' :
                    t.status === 'FAILED' ? 'bg-red-100 text-red-700 print:border print:border-red-500' :
                    'bg-yellow-100 text-yellow-700 print:border print:border-yellow-500'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* CSS untuk menyembunyikan sidebar dll saat print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .min-h-screen > .flex-1 {
            background-color: white !important;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          table, table * {
            visibility: visible;
          }
          .p-6 {
            padding: 0 !important;
          }
          .max-w-7xl {
            max-width: 100% !important;
            margin: 0 !important;
          }
          .bg-white {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
