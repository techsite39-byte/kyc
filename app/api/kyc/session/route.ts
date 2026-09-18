import { NextResponse } from "next/server";
import { getKycProvider, getKycProviderMode, isSumsubProvider } from "@/lib/kyc";
import { saveVerification } from "@/lib/kyc/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<{ provider: "mock" | "sumsub"; userId: string; country: string; documentType: string; documentName: string }>;
    if (!body.userId || !body.country || !body.documentType || !body.documentName) {
      return NextResponse.json({ error: "Missing verification details" }, { status: 400 });
    }
    const provider = body.provider === "mock" ? new (await import("@/lib/kyc/mock-provider")).MockKycProvider() : getKycProvider();
    const input = { userId: body.userId, country: body.country, documentType: body.documentType, documentName: body.documentName };
    const verification = await provider.createVerification(input);
    const mode = body.provider || getKycProviderMode();
    saveVerification(verification, mode, mode === "sumsub" ? "INIT" : "PENDING");
    if (isSumsubProvider(provider)) {
      const session = await provider.createWebSdkSession(input);
      return NextResponse.json({ provider: "sumsub", verificationId: verification.id, ...session });
    }
    return NextResponse.json({ provider: "mock", verificationId: verification.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create verification session";
    return NextResponse.json({ error: message.includes("not configured") ? "Sumsub Sandbox is not configured" : "Unable to create verification session" }, { status: message.includes("not configured") ? 503 : 502 });
  }
}
