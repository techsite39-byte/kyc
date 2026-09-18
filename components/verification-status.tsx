"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui";
import type { VerificationStatus } from "@/lib/kyc/types";

export function VerificationStatusCard() {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  useEffect(() => { fetch("/api/kyc/status?userId=demo-user").then((response) => response.json()).then((data: { verification?: { status: VerificationStatus } | null }) => setStatus(data.verification?.status || null)).catch(() => undefined); }, []);
  const label = status || "INIT";
  const tone = label === "VERIFIED" ? "green" : label === "REJECTED" ? "red" : label === "IN_REVIEW" ? "amber" : "blue";
  return <Badge tone={tone}>{label.replace("_", " ")}</Badge>;
}
