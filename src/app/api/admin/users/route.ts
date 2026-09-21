import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, newBalance } = await req.json();

    if (!userId || typeof newBalance !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tokenBalance: newBalance }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Saldo berhasil diupdate",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        tokenBalance: updatedUser.tokenBalance
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
