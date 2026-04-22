import { NextRequest, NextResponse } from "next/server";

// NEXT_PUBLIC_API_URL ya es la base REST (e.g. "https://plazze.app/wp-json")
const WP_BANNER_URL = `${process.env.NEXT_PUBLIC_API_URL}/plazze/v1/banner`;

/**
 * Proxy para POST /plazze/v1/banner
 *
 * Algunos entornos de servidor (WAF, Cloudflare, rate limiter) bloquean la
 * petición antes de que PHP ejecute y devuelven 403 sin headers CORS.
 * Al enrutar la creación de banners por aquí, el browser solo habla con el
 * servidor Next.js (misma origen) y el request a WordPress es server-to-server.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const origin = request.headers.get("origin") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(WP_BANNER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        // Reenviar Origin y User-Agent del browser original para que el WAF
        // identifique la petición como tráfico legítimo y no la bloquee.
        ...(origin ? { Origin: origin } : {}),
        ...(userAgent ? { "User-Agent": userAgent } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el servidor" },
      { status: 502 },
    );
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
