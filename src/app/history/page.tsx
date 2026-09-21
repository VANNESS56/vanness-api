import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true }
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch search history
  const searchHistory = await prisma.searchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50 // limit to last 50
  });

  // Fetch deposit history
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50 // limit to last 50
  });

  return (
    <HistoryClient 
      username={user.username}
      searchHistory={searchHistory}
      transactions={transactions}
    />
  );
}
