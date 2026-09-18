"use client";

import dynamic from "next/dynamic";
import type { MessageHandler } from "@sumsub/websdk";

const SumsubWebSdk = dynamic(() => import("@sumsub/websdk-react"), { ssr: false });

export function SumsubWidget({ accessToken, onComplete }: { accessToken: string; onComplete: (message: string) => void }) {
  const refreshToken = async () => {
    const response = await fetch("/api/kyc/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: "demo-user", country: "United States", documentType: "passport", documentName: "Passport" }) });
    const data = await response.json() as { token?: string };
    if (!response.ok || !data.token) throw new Error("Unable to refresh Sumsub Sandbox session");
    return data.token;
  };
  const onMessage: MessageHandler = (type) => onComplete(type);
  return <div className="min-h-[460px] overflow-hidden rounded-2xl border border-slate-200"><SumsubWebSdk accessToken={accessToken} testEnv expirationHandler={refreshToken} onMessage={onMessage} onError={() => onComplete("error")} /></div>;
}
