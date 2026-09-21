import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const services = [
  { id: "cek_nik", name: "Cek NIK KTP", cost: 3, url: "https://api.betabotz.eu.org/api/search/nik?nik=", param: "nik" },
  { id: "nikfoto", name: "Cek NIK + Foto", cost: 3, url: "https://api.betabotz.eu.org/api/search/nikfoto?nik=", param: "nik" },
  { id: "cek_nama", name: "Cek Nama", cost: 3, url: "https://api.betabotz.eu.org/api/search/nama?nama=", param: "nama" },
  { id: "nik2kk", name: "Cek NIK ke KK", cost: 3, url: "https://api.betabotz.eu.org/api/search/nik2kk?nik=", param: "nik" },
  { id: "kk", name: "Cek KK", cost: 3, url: "https://api.betabotz.eu.org/api/search/kk?nokk=", param: "nokk" },
  { id: "nopol", name: "Cek Plat Nomor", cost: 3, url: "https://api.betabotz.eu.org/api/search/plat?plat=", param: "plat" },
  { id: "data-bocor", name: "Cek Data Bocor", cost: 3, url: "https://api.betabotz.eu.org/api/search/data-bocor?q=", param: "q" },
  { id: "fr", name: "Face Recognition", cost: 5, url: "https://api.betabotz.eu.org/api/search/fr?url=", param: "url" },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  try {
    const { endpoint } = await params;

    // 1. Rate Limiting (Based on IP)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = checkRateLimit(`public:${ip}`, { maxRequests: 20, windowSeconds: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Terlalu banyak request. Coba lagi nanti." }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const apikey = searchParams.get("apikey");

    // 2. Cek API Key
    if (!apikey) {
      return NextResponse.json({ error: "API Key tidak disertakan (?apikey=...)" }, { status: 401 });
    }

    // 3. Lookup User
    const user = await prisma.user.findUnique({
      where: { apiKey: apikey }
    });

    if (!user) {
      return NextResponse.json({ error: "API Key tidak valid." }, { status: 401 });
    }

    // 4. Validasi Layanan & Parameter
    const service = services.find(s => s.id === endpoint);
    if (!service) {
      return NextResponse.json({ error: "Endpoint tidak ditemukan" }, { status: 404 });
    }

    const queryParam = searchParams.get(service.param);
    if (!queryParam) {
      return NextResponse.json({ error: `Parameter '${service.param}' wajib diisi.` }, { status: 400 });
    }

    // 5. Cek Saldo Token
    if (user.tokenBalance < service.cost) {
      return NextResponse.json({ error: "Saldo token tidak mencukupi", required: service.cost, current: user.tokenBalance }, { status: 402 });
    }

    // 6. Tembak ke BetaBotz
    const betabotzApiKey = process.env.BETABOTZ_API_KEY || "Vanness";
    const targetUrl = `${service.url}${encodeURIComponent(queryParam)}&apikey=${betabotzApiKey}`;
    
    console.log(`[Public API] User ${user.username} calling ${endpoint}`);
    
    const betabotzRes = await fetch(targetUrl);
    const resultData = await betabotzRes.json();

    if (!betabotzRes.ok || !resultData.status) {
       return NextResponse.json({ error: "Gagal mengambil data dari server pusat" }, { status: 502 });
    }

    // 7. Deduct Token & Log (Gunakan transaksi agar aman)
    await prisma.$transaction(async (tx) => {
      // Kurangi token
      await tx.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: service.cost } }
      });

      // Catat history
      await tx.searchHistory.create({
        data: {
          userId: user.id,
          endpointUsed: service.name,
          query: queryParam,
          costTokens: service.cost,
          result: JSON.stringify(resultData),
        }
      });
    });

    // 8. Return response
    return NextResponse.json({
      creator: "PannessAPI",
      status: true,
      data: resultData.result || resultData,
      tokens_deducted: service.cost,
      tokens_remaining: user.tokenBalance - service.cost,
    });

  } catch (error) {
    console.error("Public API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
