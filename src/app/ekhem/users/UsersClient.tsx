"use client";

import { useState } from "react";
import Swal from 'sweetalert2';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setNewBalance(user.tokenBalance.toString());
  };

  const handleSave = async () => {
    if (!editingUser || !newBalance) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          newBalance: parseInt(newBalance)
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === editingUser.id ? { ...u, tokenBalance: parseInt(newBalance) } : u
        ));
        setEditingUser(null);
        Swal.fire({ title: 'Berhasil', text: 'Data pengguna diperbarui', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire('Gagal', data.error || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-sm">
              <th className="py-3 px-4 font-medium">Username</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium">Saldo Token</th>
              <th className="py-3 px-4 font-medium">Tanggal Daftar</th>
              <th className="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{user.username}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-semibold">
                    {user.tokenBalance} Token
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit Saldo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Saldo Token</h3>
            <div className="mb-4 text-sm text-gray-600">
              Pengguna: <span className="font-semibold text-gray-900">{editingUser.username}</span>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Saldo Baru
              </label>
              <input 
                type="number" 
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
