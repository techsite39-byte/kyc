import { NextResponse } from "next/server";
import { getLatestVerification } from "@/lib/kyc/store";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  return NextResponse.json({ verification: getLatestVerification(userId) ?? null });
}
