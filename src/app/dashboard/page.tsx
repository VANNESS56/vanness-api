import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokenBalance: true, username: true, role: true }
  });

  if (!user) {
    redirect("/login");
  }

  // Get start of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Fetch metrics
  const [totalUser, todayAllServer, todayUser, totalUserRequests] = await Promise.all([
    prisma.user.count(),
    prisma.searchHistory.count({
      where: { createdAt: { gte: startOfToday } }
    }),
    prisma.searchHistory.count({
      where: { 
        userId: session.user.id,
        createdAt: { gte: startOfToday } 
      }
    }),
    prisma.searchHistory.count({
      where: { userId: session.user.id }
    })
  ]);

  return (
    <DashboardClient 
      username={user.username} 
      initialTokenBalance={user.tokenBalance} 
      metrics={{
        totalUser,
        todayAllServer,
        todayUser,
        totalUserRequests,
        tier: user.role === "ADMIN" ? "Admin User" : "Free User"
      }}
    />
  );
}
