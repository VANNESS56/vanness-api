import { prisma } from "@/lib/prisma";
import LaporanClient from "./LaporanClient";

export default async function LaporanPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { username: true, email: true }
      }
    }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <LaporanClient initialTransactions={transactions} />
    </div>
  );
}
