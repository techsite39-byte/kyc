import type { VerificationRequest, VerificationStatus } from "./types";

type VerificationRecord = { request: VerificationRequest; status: VerificationStatus; provider: "mock" | "sumsub"; eventIds: Set<string> };
const globalStore = globalThis as typeof globalThis & { __kycRecords?: Map<string, VerificationRecord> };
const records = globalStore.__kycRecords || new Map<string, VerificationRecord>();
globalStore.__kycRecords = records;

export function saveVerification(request: VerificationRequest, provider: "mock" | "sumsub", status: VerificationStatus) {
  records.set(request.id, { request, provider, status, eventIds: new Set() });
  return records.get(request.id);
}

export function updateVerification(id: string, status: VerificationStatus, eventId?: string) {
  const record = records.get(id) || Array.from(records.values()).find((candidate) => candidate.request.userId === id);
  if (!record) return false;
  if (eventId && record.eventIds.has(eventId)) return false;
  if (eventId) record.eventIds.add(eventId);
  record.status = status;
  return true;
}

export function getVerification(id: string) {
  return records.get(id);
}

export function getLatestVerification(userId: string) {
  return Array.from(records.values()).reverse().find((record) => record.request.userId === userId);
}
