import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WhatsAppPanelClient from "./WhatsAppPanelClient";

export default async function WhatsAppPanelPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokenBalance: true, username: true }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <WhatsAppPanelClient
      username={user.username}
      initialTokenBalance={user.tokenBalance}
    />
  );
}
