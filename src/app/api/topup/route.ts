import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, TOPUP_RATE_LIMIT } from "@/lib/rate-limit";

const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY;
const PAKASIR_PROJECT = "vanness-store"; // from PROJECT.md
const PRICE_PER_TOKEN = 2500;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting per user
    const rl = checkRateLimit(`topup:${session.user.id}`, TOPUP_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan topup. Tunggu sebentar." },
        { 
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) }
        }
      );
    }

    const { tokenAmount } = await req.json();

    if (!tokenAmount || tokenAmount < 5) {
      return NextResponse.json({ error: "Minimal pembelian 5 token" }, { status: 400 });
    }

    const amount = tokenAmount * PRICE_PER_TOKEN;

    // Create pending transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        orderId: `INV-${Date.now()}-${session.user.id.substring(0, 4)}`, // Generate unique order ID
        amount,
        tokenAmount,
        paymentMethod: "qris",
      }
    });

    // Call Pakasir API
    const response = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: PAKASIR_PROJECT,
        order_id: transaction.orderId,
        amount: transaction.amount,
        api_key: PAKASIR_API_KEY
      })
    });

    const data = await response.json();

    if (!response.ok || !data.payment) {
      console.error("Pakasir error:", data);
      return NextResponse.json({ error: "Gagal membuat pembayaran" }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Topup Route Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
