import { prisma } from "@/lib/prisma";
import VouchersClient from "./VouchersClient";

export default async function ManageVouchersPage() {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manajemen Voucher</h1>
      <VouchersClient initialVouchers={vouchers} />
    </div>
  );
}
