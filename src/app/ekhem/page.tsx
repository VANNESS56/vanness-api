import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Get statistics
  const totalUsers = await prisma.user.count();
  const totalTransactions = await prisma.transaction.count({
    where: { status: "COMPLETED" }
  });
  
  const transactions = await prisma.transaction.findMany({
    where: { status: "COMPLETED" }
  });
  
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      username: true,
      email: true,
      tokenBalance: true,
      createdAt: true
    }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ikhtisar Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-blue-500 shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1 font-medium">Total Pengguna</div>
          <div className="text-3xl font-bold text-gray-900">{totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-green-500 shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1 font-medium">Transaksi Berhasil</div>
          <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[var(--color-primary)] shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1 font-medium">Total Pendapatan</div>
          <div className="text-3xl font-bold text-gray-900">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pengguna Baru Terdaftar</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm">
                <th className="py-3 px-4 font-medium">Username</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Saldo Token</th>
                <th className="py-3 px-4 font-medium">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.username}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-semibold">
                      {user.tokenBalance} Token
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada pengguna
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
