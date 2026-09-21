import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, VOUCHER_RATE_LIMIT } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    // Rate Limiting per user
    const rl = checkRateLimit(`voucher:${session.user.id}`, VOUCHER_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Tunggu sebentar." },
        { 
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) }
        }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Kode voucher kosong" }, { status: 400 });
    }

    // Menggunakan transaksi agar aman dari race condition
    const result = await prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.findUnique({ where: { code: code.toUpperCase() } });
      
      if (!voucher) {
        throw new Error("Voucher tidak ditemukan");
      }
      
      if (voucher.isUsed) {
        throw new Error("Voucher sudah terpakai");
      }

      // Tandai voucher sebagai terpakai
      const updatedVoucher = await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedById: session.user.id,
          usedAt: new Date()
        }
      });

      // Tambahkan saldo user
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          tokenBalance: { increment: voucher.tokenAmount }
        }
      });

      return {
        amount: voucher.tokenAmount,
        newBalance: updatedUser.tokenBalance
      };
    });

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil redeem ${result.amount} Token!`,
      newBalance: result.newBalance
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
