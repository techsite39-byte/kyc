export type CustomerFlowState = { name: string; year: string; email: string; proofImage: string; selfieImage: string };

export const emptyCustomerFlow: CustomerFlowState = { name: "", year: "", email: "", proofImage: "", selfieImage: "" };
const storageKey = "customer-verification-flow";

export function readCustomerFlow(): CustomerFlowState {
  if (typeof window === "undefined") return emptyCustomerFlow;
  try {
    return { ...emptyCustomerFlow, ...JSON.parse(window.sessionStorage.getItem(storageKey) || "{}") };
  } catch {
    return emptyCustomerFlow;
  }
}

export function writeCustomerFlow(state: CustomerFlowState) {
  window.sessionStorage.setItem(storageKey, JSON.stringify(state));
}
