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

    const { code, tokenAmount } = await req.json();

    if (!code || typeof tokenAmount !== "number") {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    // Check if code exists
    const existing = await prisma.voucher.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Kode voucher sudah ada" }, { status: 400 });
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase(),
        tokenAmount
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Voucher berhasil dibuat",
      voucher: newVoucher
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
