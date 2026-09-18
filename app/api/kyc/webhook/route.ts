import { NextResponse } from "next/server";
import { verifySumsubWebhook } from "@/lib/kyc/sumsub-auth";
import { updateVerification } from "@/lib/kyc/store";
import type { VerificationStatus } from "@/lib/kyc/types";

export const runtime = "nodejs";

const statusMap: Record<string, VerificationStatus> = {
  init: "INIT",
  pending: "PENDING",
  onHold: "IN_REVIEW",
  review: "IN_REVIEW",
  completed: "VERIFIED",
  approved: "VERIFIED",
  rejected: "REJECTED",
  retry: "RETRY_REQUIRED"
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-payload-digest") || request.headers.get("x-signature");
  if (!verifySumsubWebhook(rawBody, signature)) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  try {
    const payload = JSON.parse(rawBody) as { applicantId?: string; externalUserId?: string; inspectionId?: string; reviewStatus?: string; reviewResult?: { reviewAnswer?: string }; type?: string; eventId?: string };
    const id = payload.externalUserId || payload.applicantId || payload.inspectionId;
    const status = payload.reviewResult?.reviewAnswer === "GREEN" ? "VERIFIED" : payload.reviewResult?.reviewAnswer === "RED" ? "REJECTED" : statusMap[payload.reviewStatus || payload.type || ""];
    if (!id || !status) return NextResponse.json({ received: true });
    updateVerification(id, status, payload.eventId || `${payload.type || "event"}:${payload.inspectionId || id}`);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
