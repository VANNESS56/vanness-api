import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Rate Limiting per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(`register:${ip}`, AUTH_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan pendaftaran. Coba lagi nanti." },
        { 
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) }
        }
      );
    }

    const { username, email, phoneNumber, password } = await req.json();

    if (!username || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { error: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return NextResponse.json({ error: "Nomor HP sudah digunakan" }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const apiKey = `panness-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        passwordHash,
        apiKey,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Akun berhasil dibuat",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
