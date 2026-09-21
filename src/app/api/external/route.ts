import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, API_RATE_LIMIT } from "@/lib/rate-limit";

const EXTERNAL_API_BASE = "https://typically-bonus-ultram-appearance.trycloudflare.com/api";
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

const API_COSTS: Record<string, number> = {
  fr: 5,
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting per user
    const rl = checkRateLimit(`api:${session.user.id}`, API_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam beberapa saat." },
        { 
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) }
        }
      );
    }

    const { endpoint, params } = await req.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint diperlukan" }, { status: 400 });
    }

    const cost = API_COSTS[endpoint] || 3;

    // Check balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tokenBalance: true }
    });

    if (!user || user.tokenBalance < cost) {
      return NextResponse.json({ 
        error: `Token tidak cukup. Butuh ${cost} token, sisa ${user?.tokenBalance || 0} token.` 
      }, { status: 402 });
    }

    // Call external API
    const queryParams = new URLSearchParams({
      ...params,
      key: EXTERNAL_API_KEY || "",
    });

    const externalUrl = `${EXTERNAL_API_BASE}/${endpoint}?${queryParams.toString()}`;
    
    console.log(`Calling external API: ${EXTERNAL_API_BASE}/${endpoint}`);
    
    const response = await fetch(externalUrl);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(data, { status: response.status || 400 });
    }

    // Deduct token & log history in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { tokenBalance: { decrement: cost } }
      }),
      prisma.searchHistory.create({
        data: {
          userId: session.user.id,
          endpointUsed: endpoint,
          query: JSON.stringify(params),
          result: JSON.stringify({ ...data, tokens_remaining: undefined, tokens_deducted: undefined }, null, 2),
          costTokens: cost
        }
      })
    ]);

    return NextResponse.json({
      ...data,
      tokens_deducted: cost,
    });

  } catch (error) {
    console.error("External API Route Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
