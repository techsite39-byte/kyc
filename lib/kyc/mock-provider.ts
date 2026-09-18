import type { KycProvider, VerificationRequest, VerificationResult } from "./types";

export class MockKycProvider implements KycProvider {
  async createVerification(input: Omit<VerificationRequest, "id" | "createdAt">) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { ...input, id: `ver_${Date.now()}`, createdAt: new Date().toISOString() };
  }

  async verifyDocument(request: VerificationRequest): Promise<VerificationResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const approved = request.documentType !== "other";
    return {
      status: approved ? "VERIFIED" : "REJECTED",
      ocr: { fullName: "Alex Morgan", documentNumber: "DEMO-4829-1190", expiryDate: "2031-08-24" },
      documentVerified: approved,
      livenessPassed: true,
      faceMatchScore: approved ? 97 : 61,
      reason: approved ? undefined : "The selected document type is not supported in demo mode."
    };
  }
}
