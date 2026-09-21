/**
 * Rate Limiter - Menggunakan in-memory store
 * Membatasi jumlah request per IP / per User dalam jangka waktu tertentu.
 * 
 * Catatan: Untuk production berskala besar, gunakan Redis.
 * Untuk skala PannessAPI saat ini, in-memory sudah sangat cukup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp
}

const store = new Map<string, RateLimitEntry>();

// Bersihkan entry yang sudah expired setiap 60 detik
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60_000);

interface RateLimitConfig {
  /** Jumlah maksimal request yang diizinkan */
  maxRequests: number;
  /** Jangka waktu dalam detik */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Cek apakah sebuah identifier (IP/userId) masih diizinkan mengirim request
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  // Belum ada record, atau window sudah expired → buat baru
  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowSeconds * 1000,
    };
  }

  // Masih dalam window → tambahkan count
  entry.count++;

  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// =====================
// Preset konfigurasi
// =====================

/** Untuk endpoint pencarian API (POST /api/external) — 15 request per menit per user */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 15,
  windowSeconds: 60,
};

/** Untuk endpoint topup (POST /api/topup) — 5 request per menit per user */
export const TOPUP_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60,
};

/** Untuk webhook (POST /api/webhook/pakasir) — 30 request per menit per IP */
export const WEBHOOK_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 30,
  windowSeconds: 60,
};

/** Untuk login/register — 10 percobaan per menit per IP */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowSeconds: 60,
};

/** Untuk redeem voucher — 5 percobaan per menit per user */
export const VOUCHER_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60,
};
