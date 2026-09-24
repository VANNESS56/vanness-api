"use client";

import { useState } from "react";
import useSWR from "swr";
import { Settings, Plus, Save, Trash2, ShieldAlert } from "lucide-react";
import Swal from "sweetalert2";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminWaSettingsPage() {
  const { data, mutate, isLoading } = useSWR('/api/admin/wa-options', fetcher);
  
  const [options, setOptions] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);

  if (data?.options && options === null && !isLoading) {
    setOptions(data.options);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/wa-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options })
      });
      if (res.ok) {
        Swal.fire("Berhasil", "Pengaturan WA Panel berhasil disimpan!", "success");
        mutate();
      } else {
        const d = await res.json();
        Swal.fire("Gagal", d.error || "Gagal menyimpan", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan sistem", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateOption = (index: number, key: string, value: string) => {
    if (!options) return;
    const newOpts = [...options];
    newOpts[index][key] = value;
    setOptions(newOpts);
  };

  const addOption = () => {
    if (!options) return;
    setOptions([...options, { id: `custom_${Date.now()}`, name: "Opsi Baru", mode: "mode_baru", icon: "FileText" }]);
  };

  const removeOption = (index: number) => {
    if (!options) return;
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WA Panel Settings</h1>
          <p className="text-sm text-gray-500 font-medium">Konfigurasi opsi dropdown dan key API untuk WhatsApp Panel</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-yellow-800">
          <ShieldAlert size={24} className="shrink-0" />
          <div className="text-sm">
            <span className="font-bold block mb-1">Perhatian:</span>
            Ubah nama tombol dan mode (key) API di sini. Perubahan akan langsung terlihat di tampilan dashboard user.
          </div>
        </div>

        {!options ? (
          <div className="text-gray-500 text-center py-10 font-medium">Memuat data konfigurasi...</div>
        ) : (
          <div className="space-y-4">
            {options.map((opt, i) => (
              <div key={opt.id} className="p-5 bg-gray-50 border border-gray-100 rounded-xl flex flex-col md:flex-row gap-4 relative items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">ID Internal</label>
                  <input 
                    type="text" 
                    value={opt.id} 
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 text-sm focus:outline-none cursor-not-allowed font-mono"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Tombol</label>
                  <input 
                    type="text" 
                    value={opt.name} 
                    onChange={(e) => updateOption(i, "name", e.target.value)}
                    placeholder="Misal: Pesan Biasa"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mode API (Key)</label>
                  <input 
                    type="text" 
                    value={opt.mode} 
                    onChange={(e) => updateOption(i, "mode", e.target.value)}
                    placeholder="Misal: pesanbiasa"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-blue-600 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                  />
                </div>
                <button 
                  onClick={() => removeOption(i)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-lg border border-red-100 transition-colors shrink-0"
                  title="Hapus opsi ini"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <button 
              onClick={addOption}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed text-gray-600 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus size={18} /> Tambah Opsi Baru
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving || !options}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold transition-opacity disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : <><Save size={18} /> Simpan Konfigurasi</>}
          </button>
        </div>
      </div>
    </div>
  );
}
