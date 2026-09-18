import type { KycProvider, SumsubProvider, SumsubSession, VerificationRequest, VerificationResult } from "./types";
import { sumsubConfigured, sumsubRequest } from "./sumsub-auth";

interface AccessTokenResponse { token: string; userId: string; applicantId?: string; ttlInSecs?: number; }

export class SumsubKycProvider implements SumsubProvider {
  async createVerification(input: Omit<VerificationRequest, "id" | "createdAt">) {
    return { ...input, id: `sumsub_${input.userId}`, createdAt: new Date().toISOString() };
  }

  async createWebSdkSession(input: Omit<VerificationRequest, "id" | "createdAt">): Promise<SumsubSession> {
    if (!sumsubConfigured()) throw new Error("Sumsub Sandbox is not configured");
    const path = `/resources/accessTokens?userId=${encodeURIComponent(input.userId)}&levelName=${encodeURIComponent(process.env.SUMSUB_LEVEL_NAME || "")}`;
    const response = await sumsubRequest<AccessTokenResponse>(path, "POST");
    return {
      token: response.token,
      userId: response.userId || input.userId,
      applicantId: response.applicantId,
      expiresAt: response.ttlInSecs ? new Date(Date.now() + response.ttlInSecs * 1000).toISOString() : undefined
    };
  }

  async verifyDocument(): Promise<VerificationResult> {
    return { status: "PENDING", ocr: { fullName: "", documentNumber: "", expiryDate: "" }, documentVerified: false, livenessPassed: false, faceMatchScore: 0 };
  }
}

export function isSumsubProvider(provider: KycProvider): provider is SumsubKycProvider {
  return provider instanceof SumsubKycProvider;
}
