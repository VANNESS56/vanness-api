import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newApiKey = `panness-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey: newApiKey },
      select: { apiKey: true },
    });

    return NextResponse.json({
      message: "API Key berhasil di-generate ulang.",
      apiKey: user.apiKey,
    });
  } catch (error) {
    console.error("Error regenerating API key:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
