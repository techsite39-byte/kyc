import type { KycProvider } from "./types";
import { MockKycProvider } from "./mock-provider";
import { SumsubKycProvider } from "./sumsub-provider";

export function getKycProvider(): KycProvider {
  return process.env.KYC_PROVIDER === "sumsub" ? new SumsubKycProvider() : new MockKycProvider();
}

export function getKycProviderMode(): "mock" | "sumsub" {
  return process.env.KYC_PROVIDER === "sumsub" ? "sumsub" : "mock";
}
