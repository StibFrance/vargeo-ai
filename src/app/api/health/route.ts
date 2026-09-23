import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    await db().query("SELECT 1 AS ok");
    return NextResponse.json({
      ok: true,
      service: "VarGeo.AI",
      version: "1.0.1",
      database: "ok",
      latency_ms: Date.now() - started,
    });
  } catch (error) {
    console.error("healthcheck", error);
    return NextResponse.json(
      { ok: false, service: "VarGeo.AI", version: "1.0.1", database: "unavailable" },
      { status: 503 }
    );
  }
}
