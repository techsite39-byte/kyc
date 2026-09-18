export type VerificationStatus = "INIT" | "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED" | "RETRY_REQUIRED";
export type VerificationStep = "country" | "document" | "upload" | "review" | "selfie" | "liveness" | "processing" | "result";

export interface VerificationRequest {
  id: string;
  userId: string;
  country: string;
  documentType: string;
  documentName: string;
  createdAt: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  ocr: { fullName: string; documentNumber: string; expiryDate: string };
  documentVerified: boolean;
  livenessPassed: boolean;
  faceMatchScore: number;
  reason?: string;
}

export interface KycProvider {
  createVerification(input: Omit<VerificationRequest, "id" | "createdAt">): Promise<VerificationRequest>;
  verifyDocument(request: VerificationRequest): Promise<VerificationResult>;
}

export interface SumsubSession {
  token: string;
  userId: string;
  applicantId?: string;
  expiresAt?: string;
}

export interface SumsubProvider extends KycProvider {
  createWebSdkSession(input: Omit<VerificationRequest, "id" | "createdAt">): Promise<SumsubSession>;
}
