import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function ManageUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      tokenBalance: true,
      role: true,
      createdAt: true
    }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manajemen Pengguna</h1>
      <UsersClient initialUsers={users} />
    </div>
  );
}
