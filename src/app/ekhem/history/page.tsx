"use client";

import useSWR from "swr";
import { Activity, Search, Eye } from "lucide-react";
import Swal from "sweetalert2";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminHistoryPage() {
  const { data, error } = useSWR('/api/admin/history', fetcher, { refreshInterval: 10000 });

  const handleShowDetail = (item: any) => {
    let queryStr = item.query;
    let resultStr = item.result;
    
    try { queryStr = JSON.stringify(JSON.parse(item.query), null, 2); } catch(e){}
    try { resultStr = JSON.stringify(JSON.parse(item.result), null, 2); } catch(e){}

    Swal.fire({
      title: 'Detail Pencarian',
      html: `
        <div style="text-align: left; font-size: 13px;">
          <strong>Endpoint:</strong> ${item.endpointUsed}<br/><br/>
          <strong>Parameter/Query:</strong>
          <pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 5px; overflow-x: auto; font-family: monospace;">${queryStr}</pre>
          <br/>
          <strong>Hasil (Result):</strong>
          <pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 5px; overflow-x: auto; max-height: 250px; font-family: monospace;">${resultStr || 'Tidak ada data hasil'}</pre>
        </div>
      `,
      width: 600,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#3085d6'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat API Member</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {(!data && !error) && <div className="p-8 text-center text-gray-500">Memuat riwayat...</div>}
        
        {data?.history?.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <Activity size={48} className="text-gray-300 mb-3" />
            <div className="text-gray-500 font-medium">Belum ada riwayat penggunaan API.</div>
          </div>
        )}

        {data?.history && data.history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-medium">Waktu</th>
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium">Endpoint</th>
                  <th className="py-3 px-4 font-medium">Parameter/Query</th>
                  <th className="py-3 px-4 font-medium">Biaya</th>
                  <th className="py-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--color-primary)]">
                      {item.user.username}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {item.endpointUsed}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs max-w-xs truncate" title={item.query}>
                      {item.query}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-500">
                      -{item.costTokens}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleShowDetail(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
