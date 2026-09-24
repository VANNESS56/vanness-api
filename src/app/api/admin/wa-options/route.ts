import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: "wa_panel_options" }
    });
    
    if (!config) {
      // Default fallback
      return NextResponse.json({
        options: [
          { id: "text", name: "Pesan Teks", mode: "pesanbiasa", icon: "FileText" },
          { id: "image", name: "Pesan Gambar", mode: "pesandokumen", icon: "Clock" }
        ]
      });
    }

    return NextResponse.json({ options: JSON.parse(config.value) });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { options } = await req.json();

    const config = await prisma.appConfig.upsert({
      where: { key: "wa_panel_options" },
      update: { value: JSON.stringify(options) },
      create: { key: "wa_panel_options", value: JSON.stringify(options) }
    });

    return NextResponse.json({ success: true, options: JSON.parse(config.value) });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
