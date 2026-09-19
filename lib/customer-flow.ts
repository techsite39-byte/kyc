export type CustomerFlowState = { name: string; password: string; aadhaarNumber: string; year: string; proofFront: string; proofBack: string; selfieImage: string };

export const emptyCustomerFlow: CustomerFlowState = { name: "", password: "", aadhaarNumber: "", year: "", proofFront: "", proofBack: "", selfieImage: "" };
const storageKey = "customer-verification-flow";

export function readCustomerFlow(): CustomerFlowState {
  if (typeof window === "undefined") return emptyCustomerFlow;
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(storageKey) || "{}");
    return { ...emptyCustomerFlow, ...stored, proofFront: stored.proofFront || stored.proofImage || "" };
  } catch {
    return emptyCustomerFlow;
  }
}

export function writeCustomerFlow(state: CustomerFlowState) {
  window.sessionStorage.setItem(storageKey, JSON.stringify(state));
}
