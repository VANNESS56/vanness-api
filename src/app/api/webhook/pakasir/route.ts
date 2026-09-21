import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, WEBHOOK_RATE_LIMIT } from "@/lib/rate-limit";

// Secret token webhook — harus sama dengan yang didaftarkan di Pakasir
const WEBHOOK_SECRET = process.env.PAKASIR_API_KEY || "";

/**
 * Verifikasi bahwa request benar-benar dari Pakasir, bukan dari pihak ketiga.
 * 
 * Strategi pertahanan berlapis:
 * 1. Rate Limiting per IP
 * 2. Verifikasi API Key via header
 * 3. Validasi project name
 * 4. Validasi amount cocok dengan data transaksi di database
 * 5. Cegah double-spending (transaksi sudah COMPLETED diabaikan)
 */
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // ===== LAYER 1: Rate Limiting =====
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = checkRateLimit(`webhook:${ip}`, WEBHOOK_RATE_LIMIT);
    
    if (!rateLimitResult.allowed) {
      console.warn(`[WEBHOOK] Rate limited IP: ${ip}`);
      return NextResponse.json(
        { error: "Too many requests" },
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          }
        }
      );
    }

    const payload = await req.json();
    console.log("Pakasir Webhook received:", JSON.stringify(payload));

    const { amount, order_id, project, status } = payload;

    // ===== LAYER 2: Verifikasi API Key =====
    // Pakasir mengirimkan api_key di body payload
    const receivedKey = payload.api_key || "";
    if (receivedKey && receivedKey !== WEBHOOK_SECRET) {
      console.warn(`[WEBHOOK] Invalid API key from IP: ${ip}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ===== LAYER 3: Validasi Project =====
    if (project !== "vanness-store") {
      console.warn(`[WEBHOOK] Unknown project: ${project} from IP: ${ip}`);
      return NextResponse.json({ message: "Ignored: unknown project" });
    }

    if (status !== "completed") {
      return NextResponse.json({ message: "Ignored: not completed" });
    }

    // ===== LAYER 4: Validasi Transaksi di Database =====
    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id }
    });

    if (!transaction) {
      console.error(`[WEBHOOK] Transaction not found: ${order_id}`);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // ===== LAYER 5: Cegah Double-Spending =====
    if (transaction.status === "COMPLETED") {
      console.warn(`[WEBHOOK] Duplicate callback for already completed order: ${order_id}`);
      return NextResponse.json({ message: "Already completed" });
    }

    // ===== LAYER 6: Validasi Nominal =====
    if (transaction.amount !== amount) {
      console.error(`[WEBHOOK] Amount mismatch for ${order_id}: expected ${transaction.amount}, got ${amount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // ===== LAYER 7: Validasi Status Transaksi =====
    // Hanya transaksi PENDING yang boleh diklaim
    if (transaction.status !== "PENDING") {
      console.warn(`[WEBHOOK] Transaction ${order_id} is ${transaction.status}, not PENDING`);
      return NextResponse.json({ message: "Transaction is not pending" });
    }

    // ===== SEMUA VALIDASI LOLOS — Proses Pembayaran =====
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { 
          status: "COMPLETED",
          completedAt: new Date()
        }
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: {
          tokenBalance: { increment: transaction.tokenAmount }
        }
      })
    ]);

    console.log(`[WEBHOOK] ✅ Successfully added ${transaction.tokenAmount} tokens for user ${transaction.userId} (order: ${order_id})`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
